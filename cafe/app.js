import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setLogLevel,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { menus, OCCUPANCY_MINUTES, seats, stores } from "./data.js";

const firebaseConfig = {
  apiKey:"AIzaSyBQ6l26Kd-lC7xP9otEFDNnep0EyPkrLpU",
  authDomain:"sevmenu-19ab6.firebaseapp.com",
  projectId:"sevmenu-19ab6",
  storageBucket:"sevmenu-19ab6.firebasestorage.app",
  messagingSenderId:"1076846992658",
  appId:"1:1076846992658:web:c8540fa0aa80bf054c27cb",
  measurementId:"G-TGMR9BS0NB"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
setLogLevel("error");

const params = new URLSearchParams(location.search);
const qrSeatId = (params.get("seat") || "").toUpperCase();
const qrSeat = seats.find(seat => seat.id === qrSeatId);

function readSavedStore(){
  try{
    return localStorage.getItem("sevCafeStore");
  }catch{
    return null;
  }
}

function saveStore(storeId){
  try{
    localStorage.setItem("sevCafeStore", storeId);
  }catch{
    // 저장소가 차단돼도 현재 세션의 매장 변경은 계속 동작합니다.
  }
}

function readLastLocalScan(key){
  try{
    return Number(sessionStorage.getItem(key) || 0);
  }catch{
    return 0;
  }
}

function saveLastLocalScan(key){
  try{
    sessionStorage.setItem(key, String(Date.now()));
  }catch{
    // 저장소가 차단되면 로컬 중복 방지만 생략합니다.
  }
}

const savedStore = readSavedStore();
const initialStore = qrSeat?.storeId || (stores.some(store => store.id === savedStore) ? savedStore : stores[0].id);

const state = {
  page:"home",
  storeId:initialStore,
  seatRecords:new Map(),
  lastSnapshotAt:null,
  currentUser:null,
  scanStarted:false
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const currentStore = () => stores.find(store => store.id === state.storeId);
const storeSeats = () => seats.filter(seat => seat.storeId === state.storeId);
const recordDate = record => record?.lastScanAt?.toDate ? record.lastScanAt.toDate() : null;
const occupiedUntil = record => {
  const scannedAt = recordDate(record);
  return scannedAt ? new Date(scannedAt.getTime() + OCCUPANCY_MINUTES * 60_000) : null;
};
const isOccupied = record => {
  const until = occupiedUntil(record);
  return Boolean(until && until.getTime() > Date.now());
};

function showToast(message){
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setConnection(message, type=""){
  const banner = $("#connectionBanner");
  banner.textContent = message;
  banner.className = `connection-banner show ${type}`.trim();
  if(type === "connected"){
    setTimeout(() => banner.classList.remove("show"), 1800);
  }
}

function go(page){
  state.page = page;
  $$(".page").forEach(section => section.classList.toggle("active", section.dataset.page === page));
  $$(".bottom-nav button").forEach(button => {
    const active = button.dataset.go === page;
    button.classList.toggle("active", active);
    if(active){
      button.setAttribute("aria-current", "page");
    }else{
      button.removeAttribute("aria-current");
    }
  });
  $("#backButton").style.visibility = page === "home" ? "hidden" : "visible";
  scrollTo({ top:0, behavior:"smooth" });
}

function selectStore(storeId){
  const changed = state.storeId !== storeId;
  state.storeId = storeId;
  saveStore(storeId);
  if(changed){
    $("#menuSearch").value = "";
  }
  renderAll();
  $("#storeDialog").close();
}

function renderStores(){
  const store = currentStore();
  $$("[data-store-name]").forEach(element => { element.textContent = store.name; });
  $("#storeList").innerHTML = stores.map(item => `
    <button type="button" class="store-option ${item.id === state.storeId ? "active" : ""}" data-store-id="${item.id}">
      <span>⌂</span>
      <span><strong>${item.name}</strong><small>${item.location} · ${item.brand}</small></span>
      <em>${item.id === state.storeId ? "✓" : "→"}</em>
    </button>
  `).join("");
  $$("[data-store-id]").forEach(button => button.addEventListener("click", () => selectStore(button.dataset.storeId)));
}

function availableSeatCount(){
  return storeSeats().filter(seat => !isOccupied(state.seatRecords.get(seat.id))).length;
}

function congestionStatus(available, total){
  const occupancyPercent = total ? Math.round(((total - available) / total) * 100) : 0;
  if(occupancyPercent >= 80){
    return { label:"혼잡", tone:"busy", occupancyPercent };
  }
  if(occupancyPercent >= 40){
    return { label:"보통", tone:"moderate", occupancyPercent };
  }
  return { label:"여유", tone:"roomy", occupancyPercent };
}

function renderSeats(){
  const available = availableSeatCount();
  const total = storeSeats().length;
  const percent = Math.round((available / total) * 100);
  const congestion = state.lastSnapshotAt
    ? congestionStatus(available, total)
    : { label:"확인 중", tone:"loading", occupancyPercent:null };
  $$("[data-available-count]").forEach(element => { element.textContent = available; });
  $("#availabilityPercent").textContent = `${percent}%`;
  $("#donut").style.setProperty("--angle", `${percent * 3.6}deg`);
  $("#seatCongestionLabel").textContent = congestion.label;
  $("#homeCongestionBadge").textContent = congestion.label;
  $("#homeCongestionBadge").className = `congestion-badge ${congestion.tone}`;
  $("#homeCongestion").setAttribute(
    "aria-label",
    congestion.occupancyPercent === null
      ? `${currentStore().name} 실시간 혼잡도 확인 중`
      : `${currentStore().name} 실시간 혼잡도 ${congestion.label}, 점유율 ${congestion.occupancyPercent}%`
  );
  $("#lastUpdated").textContent = state.lastSnapshotAt ? `${state.lastSnapshotAt.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})} 갱신` : "연결 중";
  $("#seatList").innerHTML = storeSeats().map(seat => {
    const record = state.seatRecords.get(seat.id);
    const occupied = isOccupied(record);
    return `<button class="seat ${occupied ? "occupied" : ""}" data-seat-id="${seat.id}">
      <strong>${seat.id}</strong><span>${occupied ? "이용 중" : "이용 가능"}</span>
    </button>`;
  }).join("");
  $$("[data-seat-id]").forEach(button => button.addEventListener("click", () => openSeat(button.dataset.seatId)));
}

function renderMenus(){
  const query = $("#menuSearch").value.trim().toLocaleLowerCase("ko");
  const visible = menus.filter(menu => menu.storeId === state.storeId && menu.name.toLocaleLowerCase("ko").includes(query));
  $("#menuList").innerHTML = visible.length ? visible.map(menu => `
    <button class="menu-item" data-menu-id="${menu.id}">
      <span class="menu-emoji" style="--item-color:${menu.color}">${menu.emoji}</span>
      <span><strong>${menu.name}</strong><small>${menu.variant} · ${menu.calories || "공식 영양정보 미공개"}</small></span>
      <em>+</em>
    </button>
  `).join("") : `<div class="empty-state">검색 결과가 없습니다.</div>`;
  $$("[data-menu-id]").forEach(button => button.addEventListener("click", () => openMenu(button.dataset.menuId)));
}

function renderAll(){
  renderStores();
  renderSeats();
  renderMenus();
}

function openSeat(seatId){
  const record = state.seatRecords.get(seatId);
  const scannedAt = recordDate(record);
  const occupied = isOccupied(record);
  $("#seatDialogTitle").textContent = seatId;
  $("#seatDialogState").textContent = occupied ? "이용 중" : "이용 가능";
  $("#seatDialogState").classList.toggle("occupied", occupied);
  $("#seatLastUpdated").textContent = scannedAt
    ? scannedAt.toLocaleString("ko-KR", {
        year:"numeric",
        month:"long",
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit"
      })
    : "기록 없음";
  $("#seatDialog").showModal();
}

function openMenu(menuId){
  const menu = menus.find(item => item.id === menuId);
  if(!menu) return;
  $("#menuBrand").textContent = `${menu.brand} · OFFICIAL DATA`;
  $("#menuTitle").textContent = menu.name;
  const nutrition = menu.calories ? `
    <div class="nutrition-grid">
      ${[
        ["열량",menu.calories],["당류",menu.sugar],["단백질",menu.protein],
        ["포화지방",menu.satFat],["나트륨",menu.sodium],["카페인",menu.caffeine]
      ].map(([label,value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("")}
    </div>
    <p class="source-note">알레르기 유발성분: <strong>${menu.allergy}</strong><br>2026-07-19 공식 페이지 확인 · <a href="${menu.source}" target="_blank" rel="noopener">출처 보기</a></p>
  ` : `
    <div class="unpublished"><strong>공식 영양정보 미공개</strong><p>파리크라상 공식 상품 안내에서 메뉴명은 확인되지만 영양 수치는 공개되어 있지 않아 임의 추정값을 표시하지 않습니다.</p></div>
    <p class="source-note">2026-07-19 공식 페이지 확인 · <a href="${menu.source}" target="_blank" rel="noopener">출처 보기</a></p>
  `;
  $("#menuDetail").innerHTML = `
    <div class="nutrition-hero">
      <span class="menu-emoji" style="--item-color:${menu.color}">${menu.emoji}</span>
      <div><small>기준 제공량</small><p>${menu.variant}</p></div>
    </div>${nutrition}`;
  $("#menuDialog").showModal();
}

function subscribeSeats(){
  onSnapshot(collection(db,"seats"), snapshot => {
    state.seatRecords.clear();
    snapshot.forEach(document => state.seatRecords.set(document.id, document.data()));
    state.lastSnapshotAt = new Date();
    setConnection("실시간 좌석 정보 연결됨","connected");
    renderSeats();
  }, error => {
    console.error(error);
    setConnection("Firestore 연결 실패 · Database와 보안 규칙을 확인해 주세요","error");
  });
}

async function recordQrScan(){
  if(!qrSeat || state.scanStarted || !state.currentUser) return;
  state.scanStarted = true;
  const cooldownKey = `sevCafeScan:${qrSeat.id}`;
  const lastLocalScan = readLastLocalScan(cooldownKey);
  if(Date.now() - lastLocalScan < 60_000){
    $("#scanPill").classList.add("scanned");
    $("#scanPill").innerHTML = `<span>✓</span> ${qrSeat.id} 좌석이 이미 기록됐어요`;
    showToast("1분 안의 중복 열기는 다시 기록하지 않습니다.");
    return;
  }
  try{
    const batch = writeBatch(db);
    const seatRef = doc(db,"seats",qrSeat.id);
    const eventRef = doc(collection(db,"scanEvents"));
    batch.set(seatRef,{
      seatId:qrSeat.id,
      storeId:qrSeat.storeId,
      lastScanAt:serverTimestamp()
    });
    batch.set(eventRef,{
      seatId:qrSeat.id,
      storeId:qrSeat.storeId,
      scannedAt:serverTimestamp(),
      occupancyMinutes:OCCUPANCY_MINUTES,
      source:"qr"
    });
    await batch.commit();
    saveLastLocalScan(cooldownKey);
    $("#scanPill").classList.add("scanned");
    $("#scanPill").innerHTML = `<span>✓</span> ${qrSeat.id} 이용 시작`;
    showToast(`${qrSeat.id} 좌석이 이용 중으로 기록됐습니다.`);
  }catch(error){
    console.error(error);
    state.scanStarted = false;
    $("#scanPill").innerHTML = `<span>!</span> ${qrSeat.id} 기록 실패`;
    setConnection("QR 기록 실패 · 익명 인증과 Firestore 규칙을 확인해 주세요","error");
  }
}

$$("[data-go]").forEach(button => button.addEventListener("click", () => go(button.dataset.go)));
$$("[data-open-stores]").forEach(button => button.addEventListener("click", () => $("#storeDialog").showModal()));
$("#backButton").addEventListener("click", () => go("home"));
$("#menuSearch").addEventListener("input", renderMenus);

onAuthStateChanged(auth, async user => {
  if(user){
    state.currentUser = user;
    await recordQrScan();
    return;
  }
  try{
    await signInAnonymously(auth);
  }catch(error){
    console.error(error);
    setConnection("익명 인증이 꺼져 있습니다 · Firebase Console에서 활성화해 주세요","error");
  }
});

setInterval(renderSeats,30_000);
renderAll();
go("home");
if(qrSeatId && !qrSeat){
  $("#scanPill").classList.add("invalid");
  $("#scanPill").innerHTML = `<span>!</span> 유효하지 않은 좌석 QR이에요`;
}
subscribeSeats();
