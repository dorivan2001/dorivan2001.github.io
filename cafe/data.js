export const OCCUPANCY_MINUTES = 50;

export const stores = [
  { id:"main-foodcourt", code:"A", name:"본관 푸드코트", brand:"투썸플레이스", location:"본관 3층", seatPrefix:"A", description:"투썸플레이스 대표 음료를 만나는 파일럿 공간" },
  { id:"woori-lounge", code:"B", name:"우리라운지", brand:"파스쿠찌", location:"본관 2층", seatPrefix:"B", description:"파스쿠찌 커피와 함께 쉬어가는 라운지" },
  { id:"cancer-deli", code:"C", name:"암병원 델리", brand:"파리크라상", location:"암병원 지하 1층", seatPrefix:"C", description:"파리크라상 카페 메뉴를 제공하는 델리 공간" },
  { id:"general-cafe", code:"D", name:"종합관 카페", brand:"이디야", location:"종합관 1층", seatPrefix:"D", description:"이디야 대표 음료를 만나는 종합관 카페" }
];

export const seats = stores.flatMap(store =>
  Array.from({ length:5 }, (_, index) => ({
    id:`${store.seatPrefix}${String(index + 1).padStart(3,"0")}`,
    storeId:store.id
  }))
);

const twosome = "투썸플레이스";
const pascucci = "파스쿠찌";
const paris = "파리크라상";
const ediya = "이디야";

export const menus = [
  {id:"two-americano",storeId:"main-foodcourt",brand:twosome,name:"아메리카노",variant:"Regular · HOT · 355ml",emoji:"☕",color:"#e8ded2",calories:"15 kcal",sugar:"0 g",protein:"1 g 미만",satFat:"0 g",sodium:"8 mg",caffeine:"186 mg",allergy:"없음",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100001"},
  {id:"two-latte",storeId:"main-foodcourt",brand:twosome,name:"카페 라떼",variant:"Regular · HOT · 355ml",emoji:"☕",color:"#eee1d0",calories:"190 kcal",sugar:"12 g",protein:"9 g",satFat:"6 g",sodium:"100 mg",caffeine:"186 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100002"},
  {id:"two-cappuccino",storeId:"main-foodcourt",brand:twosome,name:"카푸치노",variant:"Regular · HOT · 355ml",emoji:"☕",color:"#ead8c7",calories:"145 kcal",sugar:"9 g",protein:"6 g",satFat:"4 g",sodium:"75 mg",caffeine:"186 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100003"},
  {id:"two-vanilla",storeId:"main-foodcourt",brand:twosome,name:"바닐라 라떼",variant:"Regular · HOT · 355ml",emoji:"🥛",color:"#f1e7cb",calories:"265 kcal",sugar:"31 g",protein:"8 g",satFat:"6 g",sodium:"85 mg",caffeine:"186 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100004"},
  {id:"two-mocha",storeId:"main-foodcourt",brand:twosome,name:"카페 모카",variant:"Regular · HOT · 355ml",emoji:"🍫",color:"#e8d6ce",calories:"360 kcal",sugar:"37 g",protein:"10 g",satFat:"8 g",sodium:"130 mg",caffeine:"192 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100005"},
  {id:"two-caramel",storeId:"main-foodcourt",brand:twosome,name:"카라멜 마키아또",variant:"Regular · HOT · 355ml",emoji:"☕",color:"#edd7bd",calories:"265 kcal",sugar:"28 g",protein:"8 g",satFat:"6 g",sodium:"115 mg",caffeine:"186 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100007"},
  {id:"two-coldbrew",storeId:"main-foodcourt",brand:twosome,name:"콜드브루",variant:"Regular · ICED · 414ml",emoji:"🧊",color:"#d9e7eb",calories:"15 kcal",sugar:"0 g",protein:"1 g 미만",satFat:"0 g",sodium:"20 mg",caffeine:"212 mg",allergy:"없음",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100021"},
  {id:"two-coldbrew-latte",storeId:"main-foodcourt",brand:twosome,name:"콜드브루 라떼",variant:"Regular · ICED · 414ml",emoji:"🧊",color:"#e5e1d7",calories:"90 kcal",sugar:"6 g",protein:"4 g",satFat:"2.5 g",sodium:"60 mg",caffeine:"212 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10100022"},
  {id:"two-vanilla-coldbrew",storeId:"main-foodcourt",brand:twosome,name:"바닐라빈 콜드브루 라떼",variant:"Regular · ICED · 414ml",emoji:"🧊",color:"#eee3cf",calories:"250 kcal",sugar:"34 g",protein:"6 g",satFat:"5 g",sodium:"170 mg",caffeine:"132 mg",allergy:"우유",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10192129"},
  {id:"two-decaf",storeId:"main-foodcourt",brand:twosome,name:"디카페인 콜드브루",variant:"Regular · ICED · 414ml",emoji:"🌿",color:"#e0eee5",calories:"13 kcal",sugar:"0 g",protein:"1 g 미만",satFat:"0 g",sodium:"25 mg",caffeine:"8 mg",allergy:"없음",source:"https://mo.twosome.co.kr/mn/menuInfoDetail.do?menuCd=10191489"},

  {id:"pas-americano",storeId:"woori-lounge",brand:pascucci,name:"아메리카노",variant:"Regular · HOT · 370g",emoji:"☕",color:"#eadbd0",calories:"15 kcal",sugar:"0 g",protein:"1 g",satFat:"0 g",sodium:"20 mg",caffeine:"213 mg",allergy:"없음",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3117"},
  {id:"pas-latte",storeId:"woori-lounge",brand:pascucci,name:"카페라떼",variant:"Regular · HOT · 370g",emoji:"☕",color:"#eee0d0",calories:"110 kcal",sugar:"7 g",protein:"6 g",satFat:"4 g",sodium:"85 mg",caffeine:"219 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3118"},
  {id:"pas-caramel",storeId:"woori-lounge",brand:pascucci,name:"카라멜 라떼 마끼아또",variant:"Regular · HOT · 275g",emoji:"☕",color:"#edd4b8",calories:"189 kcal",sugar:"19 g",protein:"7 g",satFat:"4.1 g",sodium:"134 mg",caffeine:"196 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3119"},
  {id:"pas-vanilla",storeId:"woori-lounge",brand:pascucci,name:"바닐라 라떼 마끼아또",variant:"Regular · HOT · 260g",emoji:"🥛",color:"#f0e5cc",calories:"166 kcal",sugar:"24 g",protein:"7 g",satFat:"4.3 g",sodium:"107 mg",caffeine:"188 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3122"},
  {id:"pas-mocha",storeId:"woori-lounge",brand:pascucci,name:"카페 모카",variant:"Regular · HOT · 379g",emoji:"🍫",color:"#e5d3cc",calories:"280 kcal",sugar:"28 g",protein:"6 g",satFat:"10 g",sodium:"95 mg",caffeine:"202 mg",allergy:"우유, 대두",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3197"},
  {id:"pas-cappuccino",storeId:"woori-lounge",brand:pascucci,name:"카푸치노",variant:"Regular · HOT · 240g",emoji:"☕",color:"#ead9ca",calories:"131 kcal",sugar:"12 g",protein:"6 g",satFat:"4.4 g",sodium:"89 mg",caffeine:"190 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100020&productSeq=3198"},
  {id:"pas-iced-americano",storeId:"woori-lounge",brand:pascucci,name:"아이스 아메리카노",variant:"Regular · ICED · 370g",emoji:"🧊",color:"#dbe7eb",calories:"15 kcal",sugar:"0 g",protein:"1 g",satFat:"0 g",sodium:"20 mg",caffeine:"213 mg",allergy:"없음",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100030&productSeq=2969"},
  {id:"pas-iced-latte",storeId:"woori-lounge",brand:pascucci,name:"아이스 카페라떼",variant:"Regular · ICED · 370g",emoji:"🧊",color:"#e7e1d6",calories:"110 kcal",sugar:"7 g",protein:"6 g",satFat:"4 g",sodium:"85 mg",caffeine:"219 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100030&productSeq=2970"},
  {id:"pas-coldbrew",storeId:"woori-lounge",brand:pascucci,name:"콜드브루 아메리카노",variant:"Regular · ICED · 350g",emoji:"🧊",color:"#d9e6ea",calories:"10 kcal",sugar:"0 g",protein:"1 g",satFat:"0 g",sodium:"10 mg",caffeine:"201 mg",allergy:"없음",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100040&productSeq=2958"},
  {id:"pas-coldbrew-latte",storeId:"woori-lounge",brand:pascucci,name:"콜드브루 라떼",variant:"Regular · ICED · 350g",emoji:"🧊",color:"#e5e0d4",calories:"80 kcal",sugar:"5 g",protein:"4 g",satFat:"2.5 g",sodium:"55 mg",caffeine:"190 mg",allergy:"우유",source:"https://www.pascucci.co.kr/product/productList.asp?typeCode=00100040&productSeq=2960"},

  ...["에스프레소","아메리카노","아이스 아메리카노","카페라떼","아이스라떼","모카라떼","아이스 모카라떼","바닐라라떼","아이스 바닐라라떼","카푸치노"].map((name,index)=>({
    id:`paris-${index+1}`,storeId:"cancer-deli",brand:paris,name,
    variant:"공식 상품 안내 기준",emoji:index===2||index===4||index===6||index===8?"🧊":"☕",
    color:index%2?"#eee2d5":"#e5edf0",calories:null,sugar:null,protein:null,satFat:null,sodium:null,caffeine:null,allergy:null,
    source:"https://www.pariscroissant.co.kr/product/list5.html?cate_no=73"
  })),

  {id:"edi-hot-americano",storeId:"general-cafe",brand:ediya,name:"HOT 카페 아메리카노",variant:"Large · HOT · 520ml",emoji:"☕",color:"#e8ddd2",calories:"16 kcal",sugar:"0 g",protein:"1 g",satFat:"0 g",sodium:"0 mg",caffeine:"158 mg",allergy:"없음",source:"https://www.ediya.com/contents/drink.html?skeyword=카페%20아메리카노"},
  {id:"edi-iced-americano",storeId:"general-cafe",brand:ediya,name:"ICED 카페 아메리카노",variant:"Large · ICED · 520ml",emoji:"🧊",color:"#dbe8ec",calories:"16 kcal",sugar:"0 g",protein:"1 g",satFat:"0 g",sodium:"0 mg",caffeine:"158 mg",allergy:"없음",source:"https://www.ediya.com/contents/drink.html?skeyword=카페%20아메리카노"},
  {id:"edi-hot-latte",storeId:"general-cafe",brand:ediya,name:"HOT 카페 라떼",variant:"Large · HOT · 520ml",emoji:"☕",color:"#ede0d1",calories:"210 kcal",sugar:"15 g",protein:"10 g",satFat:"7 g",sodium:"155 mg",caffeine:"9 mg",allergy:"우유",source:"https://www.ediya.com/contents/drink.html?skeyword=카페%20라떼"},
  {id:"edi-iced-latte",storeId:"general-cafe",brand:ediya,name:"ICED 카페 라떼",variant:"Large · ICED · 520ml",emoji:"🧊",color:"#e3e4dc",calories:"137 kcal",sugar:"10 g",protein:"6 g",satFat:"5 g",sodium:"98 mg",caffeine:"9 mg",allergy:"우유",source:"https://www.ediya.com/contents/drink.html?skeyword=카페%20라떼"},
  {id:"edi-cappuccino",storeId:"general-cafe",brand:ediya,name:"HOT 카푸치노",variant:"Large · HOT · 520ml",emoji:"☕",color:"#ead8c8",calories:"146 kcal",sugar:"10 g",protein:"7 g",satFat:"5 g",sodium:"99 mg",caffeine:"158 mg",allergy:"우유",source:"https://www.ediya.com/contents/drink.html?skeyword=카푸치노"},
  {id:"edi-vanilla",storeId:"general-cafe",brand:ediya,name:"ICED 바닐라 라떼",variant:"Large · ICED · 520ml",emoji:"🥛",color:"#f0e6cd",calories:"271 kcal",sugar:"21 g",protein:"8 g",satFat:"5 g",sodium:"109 mg",caffeine:"158 mg",allergy:"우유, 대두",source:"https://www.ediya.com/contents/drink.html?skeyword=바닐라%20라떼"},
  {id:"edi-toffee",storeId:"general-cafe",brand:ediya,name:"ICED 토피넛 라떼",variant:"Large · ICED · 520ml",emoji:"🥜",color:"#ead6bb",calories:"270 kcal",sugar:"24 g",protein:"8 g",satFat:"9 g",sodium:"151 mg",caffeine:"30 mg",allergy:"우유, 대두, 밀",source:"https://www.ediya.com/contents/drink.html?skeyword=토피넛%20라떼"},
  {id:"edi-mocha",storeId:"general-cafe",brand:ediya,name:"ICED 카페 모카",variant:"Large · ICED · 520ml",emoji:"🍫",color:"#e4d2cc",calories:"327 kcal",sugar:"28 g",protein:"7 g",satFat:"14 g",sodium:"164 mg",caffeine:"201 mg",allergy:"우유, 대두",source:"https://www.ediya.com/contents/drink.html?skeyword=카페%20모카"},
  {id:"edi-caramel",storeId:"general-cafe",brand:ediya,name:"ICED 카라멜 마끼아또",variant:"Large · ICED · 520ml",emoji:"☕",color:"#edd5b8",calories:"253 kcal",sugar:"36 g",protein:"7 g",satFat:"5 g",sodium:"141 mg",caffeine:"158 mg",allergy:"달걀, 우유, 아황산류, 대두",source:"https://www.ediya.com/contents/drink.html?skeyword=카라멜%20마끼아또"},
  {id:"edi-mint",storeId:"general-cafe",brand:ediya,name:"ICED 민트 모카",variant:"Large · ICED · 520ml",emoji:"🌿",color:"#d9ece4",calories:"373 kcal",sugar:"38 g",protein:"8 g",satFat:"14 g",sodium:"159 mg",caffeine:"163 mg",allergy:"우유, 대두",source:"https://www.ediya.com/contents/drink.html?skeyword=민트%20모카"}
];
