# Severance ON 카페 웹앱

기존 `https://dorivan2001.github.io/`의 SevMenu 앱 연결 기능을 유지하고,
`/cafe/`에 카페 좌석 혼잡도와 메뉴 영양정보를 추가하는 정적 웹앱입니다.

## QR 좌석

- 본관 푸드코트: A001–A005
- 우리라운지: B001–B005
- 암병원 델리: C001–C005
- 종합관 카페: D001–D005
- QR 주소 형식: `https://dorivan2001.github.io/cafe/?seat=A001`
- 마지막 서버 기록 시각을 기준으로 좌석 이용 상태를 계산합니다.
- 같은 브라우저에서 1분 안에 다시 열린 중복 요청은 다시 기록하지 않습니다.
- `/qr/index.html`은 20개 QR 인쇄용 시트이며, `qr/manifest.csv`에는 좌석별 주소가 있습니다.

## Firebase Console에서 먼저 할 일

1. `sevmenu-19ab6` 프로젝트에서 Firestore Database를 만듭니다.
2. Authentication → Sign-in method에서 `Anonymous`를 활성화합니다.
3. Authentication → Settings → Authorized domains에 `dorivan2001.github.io`를 추가합니다.
4. Firestore Rules에 `firestore.rules`의 내용을 게시합니다.
5. 테스트 후 Firestore의 `seats`, `scanEvents` 컬렉션에 기록이 생성되는지 확인합니다.

좌석 문서를 미리 만들 필요는 없습니다. 각 좌석 QR을 처음 열 때 해당 `seats` 문서와
`scanEvents` 기록이 함께 생성됩니다. 이름, 전화번호, IP 주소는 저장하지 않으며 Firebase
익명 사용자 ID도 문서에 저장하지 않습니다. 좌석·매장·서버 시각과 점유 기준 정보만
기록합니다.

Firebase CLI를 사용한다면 프로젝트 루트에서 아래 명령으로 규칙만 배포할 수 있습니다.

```bash
firebase deploy --only firestore:rules
```

## 로컬 확인

ES module과 Firebase CDN을 사용하므로 파일을 직접 더블 클릭하지 말고 간단한 로컬 서버로 엽니다.

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080/cafe/`를 열고, QR 흐름은
`http://localhost:8080/cafe/?seat=A001`로 확인합니다.

QR 인쇄 화면은 `http://localhost:8080/qr/`에서 확인합니다.

## 메뉴 데이터 기준

- 2026-07-19 각 브랜드 공식 홈페이지에서 확인했습니다.
- HOT/ICED, Regular/Large 등 화면에 표시한 기준 제공량의 수치입니다.
- 파리크라상은 공식 상품 안내에서 메뉴명은 확인되지만 영양 수치가 공개되지 않아
  `공식 영양정보 미공개`로 표시합니다.
- 브랜드가 공식 수치를 수정하면 `cafe/data.js`도 갱신해야 합니다.

## 파일럿 보안 범위

Spark 요금제에 맞춰 Firestore Security Rules와 서버 타임스탬프로 기록 필드를 제한합니다.
브라우저 시간을 미래로 바꿔 점유시간을 늘릴 수는 없지만, 공개 웹 클라이언트를 자동화해
정상 QR 요청처럼 반복 호출하는 남용까지 완전히 차단하지는 못합니다. 정식 운영 전에는
App Check와 서버 함수 방식으로 전환하는 것을 권장합니다.
