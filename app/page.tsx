"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

// Job categories based on JobKorea API classification with actual codes (전체 제거)
const jobCategories = {
  "10001": {
    name: "서비스업",
    subcategories: [
      { code: "1000001", name: "호텔·여행·항공" },
      { code: "1000002", name: "스포츠·여가·레저" },
      { code: "1000003", name: "음식료·외식·프랜차이즈" },
      { code: "1000004", name: "뷰티·미용" },
      { code: "1000005", name: "콜센터·아웃소싱·기타" },
      { code: "1000006", name: "정비·A/S·카센터" },
      { code: "1000007", name: "렌탈·임대·리스" },
      { code: "1000008", name: "서치펌·헤드헌팅" },
      { code: "1000009", name: "시설관리·빌딩·경비" },
      { code: "1000010", name: "웨딩·상조·이벤트" },
    ],
  },
  "10002": {
    name: "금융·은행업",
    subcategories: [
      { code: "1000011", name: "은행·금융" },
      { code: "1000012", name: "캐피탈·대출" },
      { code: "1000013", name: "증권·보험·카드" },
    ],
  },
  "10010": {
    name: "판매·유통업",
    subcategories: [
      { code: "1000014", name: "물류·운송·배송" },
      { code: "1000015", name: "무역·상사" },
      { code: "1000016", name: "백화점·유통·도소매" },
    ],
  },
  "10003": {
    name: "건설업",
    subcategories: [
      { code: "1000017", name: "부동산·중개·임대" },
      { code: "1000018", name: "건축·설비·환경" },
      { code: "1000019", name: "건설·시공·토목·조경" },
      { code: "1000020", name: "인테리어·자재" },
    ],
  },
  "10011": {
    name: "교육업",
    subcategories: [
      { code: "1000021", name: "학교(초·중·고·대학·특수)" },
      { code: "1000022", name: "유아·유치원·어린이집" },
      { code: "1000023", name: "학원·어학원·교육원" },
      { code: "1000024", name: "학습지·방문교육" },
    ],
  },
  "10004": {
    name: "의료·제약업",
    subcategories: [
      { code: "1000025", name: "의료(간호·원무·상담)" },
      { code: "1000026", name: "의료(병원분류별)" },
      { code: "1000027", name: "의료(진료과별)" },
      { code: "1000028", name: "제약·보건·바이오" },
      { code: "1000029", name: "사회복지·요양" },
    ],
  },
  "10005": {
    name: "미디어·광고업",
    subcategories: [
      { code: "1000030", name: "방송·케이블·프로덕션" },
      { code: "1000031", name: "신문·잡지·언론사" },
      { code: "1000032", name: "광고·홍보·전시" },
      { code: "1000033", name: "영화·음반·배급" },
      { code: "1000034", name: "연예·엔터테인먼트" },
      { code: "1000035", name: "출판·인쇄·사진" },
    ],
  },
  "10006": {
    name: "문화·예술·디자인업",
    subcategories: [
      { code: "1000036", name: "문화·공연·예술" },
      { code: "1000037", name: "디자인·CAD" },
    ],
  },
  "10007": {
    name: "IT·정보통신업",
    subcategories: [
      { code: "1000038", name: "솔루션·SI·CRM·ERP" },
      { code: "1000039", name: "웹에이전시" },
      { code: "1000040", name: "쇼핑몰·오픈마켓·소셜커머스" },
      { code: "1000041", name: "포털·컨텐츠·커뮤니티" },
      { code: "1000042", name: "네트워크·통신서비스" },
      { code: "1000043", name: "정보보안" },
      { code: "1000044", name: "컴퓨터·하드웨어·장비" },
      { code: "1000045", name: "게임·애니메이션" },
      { code: "1000046", name: "모바일·APP" },
      { code: "1000047", name: "IT컨설팅" },
    ],
  },
  "10008": {
    name: "기관·협회",
    subcategories: [
      { code: "1000048", name: "공기업·공공기관" },
      { code: "1000049", name: "협회·단체" },
      { code: "1000050", name: "컨설팅·연구·조사" },
      { code: "1000051", name: "회계·세무·법무" },
    ],
  },
  "10009": {
    name: "제조·생산·화학업",
    subcategories: [
      { code: "1000052", name: "전기·전자·제어" },
      { code: "1000053", name: "반도체·디스플레이·광학" },
      { code: "1000054", name: "기계·기계설비" },
      { code: "1000055", name: "자동차·조선·철강·항공" },
      { code: "1000056", name: "금속·재료·자재" },
      { code: "1000057", name: "화학·에너지·환경" },
      { code: "1000058", name: "섬유·의류·패션" },
      { code: "1000059", name: "생활화학·화장품" },
      { code: "1000060", name: "생활용품·소비재·기타" },
      { code: "1000061", name: "목재·제지·가구" },
      { code: "1000062", name: "식품가공" },
      { code: "1000063", name: "농축산·어업·임업" },
    ],
  },
  "10026": {
    name: "기획·전략",
    subcategories: [
      { code: "1000185", name: "경영·비즈니스기획" },
      { code: "1000186", name: "웹기획" },
      { code: "1000187", name: "마케팅기획" },
      { code: "1000188", name: "PL·PM·PO" },
      { code: "1000189", name: "컨설턴트" },
      { code: "1000190", name: "CEO·COO·CTO" },
    ],
  },
  "10027": {
    name: "법무·사무·총무",
    subcategories: [
      { code: "1000191", name: "경영지원" },
      { code: "1000192", name: "사무담당자" },
      { code: "1000193", name: "총무" },
      { code: "1000194", name: "사무보조" },
      { code: "1000195", name: "법무담당자" },
      { code: "1000196", name: "비서" },
      { code: "1000197", name: "변호사" },
      { code: "1000198", name: "법무사" },
      { code: "1000199", name: "변리사" },
      { code: "1000200", name: "노무사" },
    ],
  },
  "10028": {
    name: "인사·HR",
    subcategories: [
      { code: "1000201", name: "인사담당자" },
      { code: "1000202", name: "HRD·HRM" },
      { code: "1000203", name: "노무관리자" },
      { code: "1000204", name: "잡매니저" },
      { code: "1000205", name: "헤드헌터" },
      { code: "1000206", name: "직업상담사" },
    ],
  },
  "10029": {
    name: "회계·세무",
    subcategories: [
      { code: "1000207", name: "회계담당자" },
      { code: "1000208", name: "경리" },
      { code: "1000209", name: "세무담당자" },
      { code: "1000210", name: "재무담당자" },
      { code: "1000211", name: "감사" },
      { code: "1000212", name: "IR·공시" },
      { code: "1000213", name: "회계사" },
      { code: "1000214", name: "세무사" },
      { code: "1000215", name: "관세사" },
    ],
  },
  "10030": {
    name: "마케팅·광고·MD",
    subcategories: [
      { code: "1000216", name: "AE(광고기획자)" },
      { code: "1000217", name: "브랜드마케터" },
      { code: "1000218", name: "퍼포먼스마케터" },
      { code: "1000219", name: "CRM마케터" },
      { code: "1000220", name: "온라인마케터" },
      { code: "1000221", name: "콘텐츠마케터" },
      { code: "1000222", name: "홍보" },
      { code: "1000223", name: "설문·리서치" },
      { code: "1000224", name: "MD" },
      { code: "1000225", name: "카피라이터" },
      { code: "1000226", name: "크리에이티브디렉터" },
      { code: "1000227", name: "채널관리자" },
      { code: "1000228", name: "그로스해커" },
    ],
  },
  "10031": {
    name: "개발·데이터",
    subcategories: [
      { code: "1000229", name: "백엔드개발자" },
      { code: "1000230", name: "프론트엔드개발자" },
      { code: "1000231", name: "웹개발자" },
      { code: "1000232", name: "앱개발자" },
      { code: "1000233", name: "시스템엔지니어" },
      { code: "1000234", name: "네트워크엔지니어" },
      { code: "1000235", name: "DBA" },
      { code: "1000236", name: "데이터엔지니어" },
      { code: "1000237", name: "데이터사이언티스트" },
      { code: "1000238", name: "보안엔지니어" },
      { code: "1000239", name: "소프트웨어개발자" },
      { code: "1000240", name: "게임개발자" },
      { code: "1000241", name: "하드웨어개발자" },
      { code: "1000242", name: "머신러닝엔지니어" },
      { code: "1000243", name: "블록체인개발자" },
      { code: "1000244", name: "클라우드엔지니어" },
      { code: "1000245", name: "웹퍼블리셔" },
      { code: "1000246", name: "IT컨설팅" },
      { code: "1000247", name: "QA" },
    ],
  },
  "10032": {
    name: "디자인",
    subcategories: [
      { code: "1000248", name: "그래픽디자이너" },
      { code: "1000249", name: "3D디자이너" },
      { code: "1000250", name: "제품디자이너" },
      { code: "1000251", name: "산업디자이너" },
      { code: "1000252", name: "광고디자이너" },
      { code: "1000253", name: "시각디자이너" },
      { code: "1000254", name: "영상디자이너" },
      { code: "1000255", name: "웹디자이너" },
      { code: "1000256", name: "UI·UX디자이너" },
      { code: "1000257", name: "패션디자이너" },
      { code: "1000258", name: "편집디자이너" },
      { code: "1000259", name: "실내디자이너" },
      { code: "1000260", name: "공간디자이너" },
      { code: "1000261", name: "캐릭터디자이너" },
      { code: "1000262", name: "환경디자이너" },
      { code: "1000263", name: "아트디렉터" },
      { code: "1000264", name: "일러스트레이터" },
    ],
  },
  "10033": {
    name: "물류·무역",
    subcategories: [
      { code: "1000265", name: "물류관리자" },
      { code: "1000266", name: "구매관리자" },
      { code: "1000267", name: "자재관리자" },
      { code: "1000268", name: "유통관리자" },
      { code: "1000269", name: "무역사무원" },
    ],
  },
  "10034": {
    name: "운전·운송·배송",
    subcategories: [
      { code: "1000270", name: "납품·배송기사" },
      { code: "1000271", name: "배달기사" },
      { code: "1000272", name: "수행·운전기사" },
      { code: "1000273", name: "화물·중장비기사" },
      { code: "1000274", name: "버스기사" },
      { code: "1000275", name: "택시기사" },
      { code: "1000276", name: "조종·기관사" },
    ],
  },
  "10035": {
    name: "영업",
    subcategories: [
      { code: "1000277", name: "제품영업" },
      { code: "1000278", name: "서비스영업" },
      { code: "1000279", name: "해외영업" },
      { code: "1000280", name: "광고영업" },
      { code: "1000281", name: "금융영업" },
      { code: "1000282", name: "법인영업" },
      { code: "1000283", name: "IT·기술영업" },
      { code: "1000284", name: "영업관리" },
      { code: "1000285", name: "영업지원" },
    ],
  },
  "10036": {
    name: "고객상담·TM",
    subcategories: [
      { code: "1000286", name: "인바운드상담원" },
      { code: "1000287", name: "아웃바운드상담원" },
      { code: "1000288", name: "고객센터관리자" },
    ],
  },
  "10037": {
    name: "금융·보험",
    subcategories: [
      { code: "1000289", name: "금융사무" },
      { code: "1000290", name: "보험설계사" },
      { code: "1000291", name: "손해사정사" },
      { code: "1000292", name: "심사" },
      { code: "1000293", name: "은행원·텔러" },
      { code: "1000294", name: "계리사" },
      { code: "1000295", name: "펀드매니저" },
      { code: "1000296", name: "애널리스트" },
    ],
  },
  "10038": {
    name: "식·음료",
    subcategories: [
      { code: "1000297", name: "요리사" },
      { code: "1000298", name: "조리사" },
      { code: "1000299", name: "제과제빵사" },
      { code: "1000300", name: "바리스타" },
      { code: "1000301", name: "셰프·주방장" },
      { code: "1000302", name: "카페·레스토랑매니저" },
      { code: "1000303", name: "홀서버" },
      { code: "1000304", name: "주방보조" },
      { code: "1000305", name: "소믈리에·바텐더" },
      { code: "1000306", name: "영양사" },
      { code: "1000307", name: "식품연구원" },
      { code: "1000308", name: "푸드스타일리스트" },
    ],
  },
  "10039": {
    name: "고객서비스·리테일",
    subcategories: [
      { code: "1000309", name: "설치·수리기사" },
      { code: "1000310", name: "정비기사" },
      { code: "1000311", name: "호텔종사자" },
      { code: "1000312", name: "여행에이전트" },
      { code: "1000313", name: "매장관리자" },
      { code: "1000314", name: "뷰티·미용사" },
      { code: "1000315", name: "애견미용·훈련" },
      { code: "1000316", name: "안내데스크·리셉셔니스트" },
      { code: "1000317", name: "경호·경비" },
      { code: "1000318", name: "운영보조·매니저" },
      { code: "1000319", name: "이벤트·웨딩플래너" },
      { code: "1000320", name: "주차·주유원" },
      { code: "1000321", name: "스타일리스트" },
      { code: "1000322", name: "장례지도사" },
      { code: "1000323", name: "가사도우미" },
      { code: "1000324", name: "승무원" },
      { code: "1000325", name: "플로리스트" },
    ],
  },
  "10040": {
    name: "엔지니어링·설계",
    subcategories: [
      { code: "1000326", name: "전기·전자엔지니어" },
      { code: "1000327", name: "기계엔지니어" },
      { code: "1000328", name: "설계엔지니어" },
      { code: "1000329", name: "설비엔지니어" },
      { code: "1000330", name: "반도체엔지니어" },
      { code: "1000331", name: "화학엔지니어" },
      { code: "1000332", name: "공정엔지니어" },
      { code: "1000333", name: "하드웨어엔지니어" },
      { code: "1000334", name: "통신엔지니어" },
      { code: "1000335", name: "RF엔지니어" },
      { code: "1000336", name: "필드엔지니어" },
      { code: "1000337", name: "R&D·연구원" },
    ],
  },
  "10041": {
    name: "제조·생산",
    subcategories: [
      { code: "1000338", name: "생산직종사자" },
      { code: "1000339", name: "생산·공정관리자" },
      { code: "1000340", name: "품질관리자" },
      { code: "1000341", name: "포장·가공담당자" },
      { code: "1000342", name: "공장관리자" },
      { code: "1000343", name: "용접사" },
    ],
  },
  "10042": {
    name: "교육",
    subcategories: [
      { code: "1000344", name: "유치원·보육교사" },
      { code: "1000345", name: "학교·특수학교교사" },
      { code: "1000346", name: "대학교수·강사" },
      { code: "1000347", name: "학원강사" },
      { code: "1000348", name: "외국어강사" },
      { code: "1000349", name: "기술·전문강사" },
      { code: "1000350", name: "학습지·방문교사" },
      { code: "1000351", name: "학원상담·운영" },
      { code: "1000352", name: "교직원·조교" },
      { code: "1000353", name: "교재개발·교수설계" },
    ],
  },
  "10043": {
    name: "건축·시설",
    subcategories: [
      { code: "1000354", name: "건축가" },
      { code: "1000355", name: "건축기사" },
      { code: "1000356", name: "시공기사" },
      { code: "1000357", name: "전기기사" },
      { code: "1000358", name: "토목기사" },
      { code: "1000359", name: "시설관리자" },
      { code: "1000360", name: "현장관리자" },
      { code: "1000361", name: "안전관리자" },
      { code: "1000362", name: "공무" },
      { code: "1000363", name: "소방설비" },
      { code: "1000364", name: "현장보조" },
      { code: "1000365", name: "감리원" },
      { code: "1000366", name: "도시·조경설계" },
      { code: "1000367", name: "환경기사" },
      { code: "1000368", name: "비파괴검사원" },
      { code: "1000369", name: "공인중개사" },
      { code: "1000370", name: "감정평가사" },
      { code: "1000371", name: "분양매니저" },
    ],
  },
  "10044": {
    name: "의료·바이오",
    subcategories: [
      { code: "1000372", name: "의사" },
      { code: "1000373", name: "한의사" },
      { code: "1000374", name: "간호사" },
      { code: "1000375", name: "간호조무사" },
      { code: "1000376", name: "약사·한약사" },
      { code: "1000377", name: "의료기사" },
      { code: "1000378", name: "수의사" },
      { code: "1000379", name: "수의테크니션" },
      { code: "1000380", name: "병원코디네이터" },
      { code: "1000381", name: "원무행정" },
      { code: "1000382", name: "기타의료종사자" },
      { code: "1000383", name: "의료·약무보조" },
      { code: "1000384", name: "바이오·제약연구원" },
      { code: "1000385", name: "임상연구원" },
    ],
  },
  "10045": {
    name: "미디어·문화·스포츠",
    subcategories: [
      { code: "1000386", name: "PD·감독" },
      { code: "1000387", name: "포토그래퍼" },
      { code: "1000388", name: "영상편집자" },
      { code: "1000389", name: "사운드엔지니어" },
      { code: "1000390", name: "스태프" },
      { code: "1000391", name: "출판·편집" },
      { code: "1000392", name: "배급·제작자" },
      { code: "1000393", name: "콘텐츠에디터" },
      { code: "1000394", name: "크리에이터" },
      { code: "1000395", name: "기자" },
      { code: "1000396", name: "작가" },
      { code: "1000397", name: "아나운서" },
      { code: "1000398", name: "리포터·성우" },
      { code: "1000399", name: "MC·쇼호스트" },
      { code: "1000400", name: "모델" },
      { code: "1000401", name: "연예인·매니저" },
      { code: "1000402", name: "인플루언서" },
      { code: "1000403", name: "통번역사" },
      { code: "1000404", name: "큐레이터" },
      { code: "1000405", name: "음반기획" },
      { code: "1000406", name: "스포츠강사" },
    ],
  },
  "10046": {
    name: "공공·복지",
    subcategories: [
      { code: "1000407", name: "사회복지사" },
      { code: "1000408", name: "요양보호사" },
      { code: "1000409", name: "환경미화원" },
      { code: "1000410", name: "보건관리자" },
      { code: "1000411", name: "사서" },
      { code: "1000412", name: "자원봉사자" },
      { code: "1000413", name: "방역·방재기사" },
    ],
  },
}

const reviewItems = [
  {
    id: 1,
    title: "근무환경/시설",
    subtitle: "사무실 환경, 편의 시설, 장비지원 등",
    type: "rating",
  },
  {
    id: 2,
    title: "근무강도/스트레스",
    subtitle: "업무량, 야근 정도, 스트레스 정도 등",
    type: "rating",
  },
  {
    id: 3,
    title: "급여/복지",
    subtitle: "급여 정도, 복지혜택, 인센티브 등",
    type: "rating",
  },
  {
    id: 4,
    title: "안정성/전망",
    subtitle: "회사 전망, 발전 가능성, 업계 전망 등",
    type: "rating",
  },
  {
    id: 5,
    title: "사람들",
    subtitle: "동료 관계, 상사, 회사 분위기 등",
    type: "rating",
  },
  {
    id: 6,
    title: "취업준비",
    subtitle: "자격증, 경력, 스펙, 포트폴리오 등",
    type: "difficulty",
  },
  {
    id: 7,
    title: "면접준비",
    subtitle: "면접 과정, 질문 유형, 면접 팁 등",
    type: "difficulty",
  },
  {
    id: 8,
    title: "이 곳에서 일하게 될 사람들에게 한마디",
    subtitle: "",
    type: "message",
  },
]

export default function JobReviewForm() {
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    education: "",
    company: "",
    postcode: "",
    roadAddress: "",
    detailAddress: "",
    workType: "현직장",
    majorCategory: "",
    minorCategory: "",
    workStartYear: "",
    workStartMonth: "",
    workEndYear: "",
    workEndMonth: "",
    proofFile: null,
    reviews: {},
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateReviewData = (itemId: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [itemId]: {
          ...prev.reviews[itemId],
          [field]: value,
        },
      },
    }))
  }

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    alert("제출 완료!")
  }

  const progressWidth = (currentPage / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800 leading-tight">
              근무 후기 이벤트 참여
            </h1>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <div className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 font-medium">
              {currentPage} / 3
            </div>

            {/* Page 1: Basic Information */}
            {currentPage === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  nextPage()
                }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm sm:text-base font-medium text-gray-700">
                    이름
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                    className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                    className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm sm:text-base font-medium text-gray-700">
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                    className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">
                    어떤 경로로 후기 이벤트를 접하게 되었나요?
                  </Label>
                  <Select value={formData.source} onValueChange={(value) => updateFormData("source", value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                      <SelectItem value="디맨드 홈페이지">디맨드 홈페이지</SelectItem>
                      <SelectItem value="디맨드 인스타그램">디맨드 인스타그램</SelectItem>
                      <SelectItem value="디맨드 스레드">디맨드 스레드</SelectItem>
                      <SelectItem value="디맨드 오픈채팅방">디맨드 오픈채팅방</SelectItem>
                      <SelectItem value="인스타그램 광고">인스타그램 광고</SelectItem>
                      <SelectItem value="디맨드 블로그">디맨드 블로그</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">최종학력</Label>
                  <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                      <SelectItem value="고졸">고졸</SelectItem>
                      <SelectItem value="초대졸">초대졸</SelectItem>
                      <SelectItem value="대졸">대졸</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm sm:text-base font-medium text-gray-700">
                    회사명(근무지명)
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    required
                    className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                  <p className="text-sm text-gray-600 mt-1">가능한 줄임 없이 풀어서 써주세요 (하닉 → SK하이닉스)</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">사업장 주소</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <Input
                      placeholder="우편번호"
                      value={formData.postcode}
                      readOnly
                      required
                      className="h-11 sm:h-12 text-base border-gray-300 rounded-lg flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 sm:h-12 px-4 sm:px-6 whitespace-nowrap border-gray-300 hover:bg-gray-50 rounded-lg font-medium bg-transparent"
                    >
                      주소 찾기
                    </Button>
                  </div>
                  <Input
                    placeholder="도로명 주소"
                    value={formData.roadAddress}
                    readOnly
                    required
                    className="mb-2 h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                  <Input
                    placeholder="상세주소 입력"
                    value={formData.detailAddress}
                    onChange={(e) => updateFormData("detailAddress", e.target.value)}
                    required
                    className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">근무 형태</Label>
                  <Select value={formData.workType} onValueChange={(value) => updateFormData("workType", value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                      <SelectItem value="현직장">현직장</SelectItem>
                      <SelectItem value="전직장">전직장</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">근무 기간</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">시작</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.workStartYear}
                          onValueChange={(value) => updateFormData("workStartYear", value)}
                        >
                          <SelectTrigger className="h-11 text-base border-gray-300 rounded-lg">
                            <SelectValue placeholder="년도" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {Array.from({ length: 31 }, (_, i) => 2025 - i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}년
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={formData.workStartMonth}
                          onValueChange={(value) => updateFormData("workStartMonth", value)}
                        >
                          <SelectTrigger className="h-11 text-base border-gray-300 rounded-lg">
                            <SelectValue placeholder="월" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {month}월
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">종료 (현직장인 경우 현재)</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.workEndYear}
                          onValueChange={(value) => updateFormData("workEndYear", value)}
                        >
                          <SelectTrigger className="h-11 text-base border-gray-300 rounded-lg">
                            <SelectValue placeholder="년도" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}년
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={formData.workEndMonth}
                          onValueChange={(value) => updateFormData("workEndMonth", value)}
                        >
                          <SelectTrigger className="h-11 text-base border-gray-300 rounded-lg">
                            <SelectValue placeholder="월" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {month}월
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm sm:text-base font-medium text-gray-700">업·직종 (대분류)</Label>
                  <Select
                    value={formData.majorCategory}
                    onValueChange={(value) => {
                      updateFormData("majorCategory", value)
                      updateFormData("minorCategory", "")
                    }}
                  >
                    <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                      {Object.entries(jobCategories).map(([code, category]) => (
                        <SelectItem key={code} value={code}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.majorCategory && jobCategories[formData.majorCategory]?.subcategories.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-sm sm:text-base font-medium text-gray-700">업·직종 (소분류)</Label>
                    <Select
                      value={formData.minorCategory}
                      onValueChange={(value) => updateFormData("minorCategory", value)}
                    >
                      <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="소분류 선택" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                        {jobCategories[formData.majorCategory].subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.code} value={subcategory.code}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="privacy" required />
                  <Label htmlFor="privacy" className="text-sm">
                    개인정보 수집 및 활용에 동의합니다.
                    <span className="text-xs text-gray-500 block mt-1">
                      (개인정보는 수집만 하고 어디에도 노출되지 않습니다)
                    </span>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  다음 (1/3)
                </Button>
              </form>
            )}

            {/* Page 2: Proof Upload */}
            {currentPage === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">현직자 인증</h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    증빙 자료를 첨부해주세요. 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로 포함됩니다. 하지만, 증빙
                    자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히 인정되면 이벤트 보상 제공 대상에
                    포함될 수 있습니다.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    nextPage()
                  }}
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center mb-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => updateFormData("proofFile", e.target.files?.[0] || null)}
                      className="block mx-auto mb-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      예: 사원증, 사내 시스템 화면 등 / 이미지 또는 PDF 파일
                      <br />
                      <span className="text-xs text-gray-500">15일 이내 자동 삭제됩니다</span>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={prevPage} className="flex-1 bg-transparent">
                      이전
                    </Button>
                    <Button type="submit" className="flex-1">
                      다음 (2/3)
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Page 3: Detailed Review */}
            {currentPage === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">현직자 상세 리뷰</h2>
                <p className="text-sm text-gray-600 mb-6">실제로 시간을 들여 후기를 남겨주세요.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {reviewItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-lg sm:text-xl mb-1 text-gray-800">
                        {item.id}. {item.title}
                      </h3>
                      {item.subtitle && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.subtitle}</p>}

                      {item.type === "rating" && (
                        <div className="mb-4">
                          <Label className="block mb-2">평점 평가</Label>
                          <Select
                            value={formData.reviews[item.id]?.rating || ""}
                            onValueChange={(value) => updateReviewData(item.id, "rating", value)}
                          >
                            <SelectTrigger className="w-full h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue placeholder="평점을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                              <SelectItem value="5">★★★★★ (5점)</SelectItem>
                              <SelectItem value="4">★★★★☆ (4점)</SelectItem>
                              <SelectItem value="3">★★★☆☆ (3점)</SelectItem>
                              <SelectItem value="2">★★☆☆☆ (2점)</SelectItem>
                              <SelectItem value="1">★☆☆☆☆ (1점)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {item.type === "difficulty" && (
                        <div className="mb-4">
                          <Label className="block mb-2">난이도 평가</Label>
                          <Select
                            value={formData.reviews[item.id]?.difficulty || ""}
                            onValueChange={(value) => updateReviewData(item.id, "difficulty", value)}
                          >
                            <SelectTrigger className="w-full h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                              <SelectValue placeholder="난이도를 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                              <SelectItem value="매우 어려움">매우 어려움</SelectItem>
                              <SelectItem value="어려움">어려움</SelectItem>
                              <SelectItem value="보통">보통</SelectItem>
                              <SelectItem value="쉬움">쉬움</SelectItem>
                              <SelectItem value="매우 쉬움">매우 쉬움</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label className="block mb-2">상세 리뷰 *</Label>
                        <Textarea
                          rows={4}
                          placeholder="최소 50자 이상 입력해주세요"
                          value={formData.reviews[item.id]?.review || ""}
                          onChange={(e) => updateReviewData(item.id, "review", e.target.value)}
                          required
                          className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-base leading-relaxed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {(formData.reviews[item.id]?.review || "").length}/50자 (최소 50자)
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevPage}
                      className="flex-1 h-12 sm:h-14 text-base font-semibold border-gray-300 hover:bg-gray-50 rounded-lg order-2 sm:order-1 bg-transparent"
                    >
                      이전
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 sm:h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 order-1 sm:order-2"
                    >
                      제출하기
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
