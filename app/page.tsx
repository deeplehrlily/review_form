"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 잡코리아 대분류 데이터
const jobCategories = [
  { id: "10001", name: "서비스업" },
  { id: "10002", name: "금융·은행업" },
  { id: "10003", name: "건설업" },
  { id: "10004", name: "의료·제약업" },
  { id: "10005", name: "미디어·광고업" },
  { id: "10006", name: "문화·예술·디자인업" },
  { id: "10007", name: "IT·정보통신업" },
  { id: "10008", name: "기관·협회" },
  { id: "10009", name: "제조·생산·화학업" },
  { id: "10010", name: "판매·유통업" },
  { id: "10011", name: "교육업" },
  { id: "10026", name: "기획·전략" },
  { id: "10027", name: "법무·사무·총무" },
  { id: "10028", name: "인사·HR" },
  { id: "10029", name: "회계·세무" },
  { id: "10030", name: "마케팅·광고·MD" },
  { id: "10031", name: "개발·데이터" },
  { id: "10032", name: "디자인" },
  { id: "10033", name: "물류·무역" },
  { id: "10034", name: "운전·운송·배송" },
  { id: "10035", name: "영업" },
  { id: "10036", name: "고객상담·TM" },
  { id: "10037", name: "금융·보험" },
  { id: "10038", name: "식·음료" },
  { id: "10039", name: "고객서비스·리테일" },
  { id: "10040", name: "엔지니어링·설계" },
  { id: "10041", name: "제조·생산" },
  { id: "10042", name: "교육" },
  { id: "10043", name: "건축·시설" },
  { id: "10044", name: "의료·바이오" },
  { id: "10045", name: "미디어·문화·스포츠" },
  { id: "10046", name: "공공·복지" },
]

// 잡코리아 소분류 데이터 (모든 대분류 포함)
const jobSubCategories: { [key: string]: { id: string; name: string }[] } = {
  "10001": [
    { id: "1000001", name: "호텔·여행·항공" },
    { id: "1000002", name: "스포츠·여가·레저" },
    { id: "1000003", name: "음식료·외식·프랜차이즈" },
    { id: "1000004", name: "뷰티·미용" },
    { id: "1000005", name: "콜센터·아웃소싱·기타" },
    { id: "1000006", name: "정비·A/S·카센터" },
    { id: "1000007", name: "렌탈·임대·리스" },
    { id: "1000008", name: "서치펌·헤드헌팅" },
    { id: "1000009", name: "시설관리·빌딩·경비" },
    { id: "1000010", name: "웨딩·상조·이벤트" },
  ],
  "10002": [
    { id: "1000011", name: "은행·금융" },
    { id: "1000012", name: "캐피탈·대출" },
    { id: "1000013", name: "증권·보험·카드" },
    { id: "1000999", name: "기타" },
  ],
  "10003": [
    { id: "1000017", name: "부동산·중개·임대" },
    { id: "1000018", name: "건축·설비·환경" },
    { id: "1000019", name: "건설·시공·토목·조경" },
    { id: "1000020", name: "인테리어·자재" },
    { id: "1000999", name: "기타" },
  ],
  "10004": [
    { id: "1000025", name: "의료(간호·원무·상담)" },
    { id: "1000026", name: "의료(병원분류별)" },
    { id: "1000027", name: "의료(진료과별)" },
    { id: "1000028", name: "제약·보건·바이오" },
    { id: "1000029", name: "사회복지·요양" },
    { id: "1000999", name: "기타" },
  ],
  "10005": [
    { id: "1000030", name: "방송·케이블·프로덕션" },
    { id: "1000031", name: "신문·잡지·언론사" },
    { id: "1000032", name: "광고·홍보·전시" },
    { id: "1000033", name: "영화·음반·배급" },
    { id: "1000034", name: "연예·엔터테인먼트" },
    { id: "1000035", name: "출판·인쇄·사진" },
    { id: "1000999", name: "기타" },
  ],
  "10006": [
    { id: "1000036", name: "문화·공연·예술" },
    { id: "1000037", name: "디자인·CAD" },
    { id: "1000999", name: "기타" },
  ],
  "10007": [
    { id: "1000038", name: "솔루션·SI·CRM·ERP" },
    { id: "1000039", name: "웹에이전시" },
    { id: "1000040", name: "쇼핑몰·오픈마켓·소셜커머스" },
    { id: "1000041", name: "포털·컨텐츠·커뮤니티" },
    { id: "1000042", name: "네트워크·통신서비스" },
    { id: "1000043", name: "정보보안" },
    { id: "1000044", name: "컴퓨터·하드웨어·장비" },
    { id: "1000045", name: "게임·애니메이션" },
    { id: "1000046", name: "모바일·APP" },
    { id: "1000047", name: "IT컨설팅" },
  ],
  "10008": [
    { id: "1000048", name: "공기업·공공기관" },
    { id: "1000049", name: "협회·단체" },
    { id: "1000050", name: "컨설팅·연구·조사" },
    { id: "1000051", name: "회계·세무·법무" },
    { id: "1000999", name: "기타" },
  ],
  "10009": [
    { id: "1000052", name: "전기·전자·제어" },
    { id: "1000053", name: "반도체·디스플레이·광학" },
    { id: "1000054", name: "기계·기계설비" },
    { id: "1000055", name: "자동차·조선·철강·항공" },
    { id: "1000056", name: "금속·재료·자재" },
    { id: "1000057", name: "화학·에너지·환경" },
    { id: "1000058", name: "섬유·의류·패션" },
    { id: "1000059", name: "생활화학·화장품" },
    { id: "1000060", name: "생활용품·소비재·기타" },
    { id: "1000061", name: "목재·제지·가구" },
    { id: "1000062", name: "식품가공" },
    { id: "1000063", name: "농축산·어업·임업" },
  ],
  "10010": [
    { id: "1000014", name: "물류·운송·배송" },
    { id: "1000015", name: "무역·상사" },
    { id: "1000016", name: "백화점·유통·도소매" },
    { id: "1000999", name: "기타" },
  ],
  "10011": [
    { id: "1000021", name: "학교(초·중·고·대학·특수)" },
    { id: "1000022", name: "유아·유치원·어린이집" },
    { id: "1000023", name: "학원·어학원·교육원" },
    { id: "1000024", name: "학습지·방문교육" },
    { id: "1000999", name: "기타" },
  ],
  "10026": [
    { id: "1000185", name: "경영·비즈니스기획" },
    { id: "1000186", name: "웹기획" },
    { id: "1000187", name: "마케팅기획" },
    { id: "1000188", name: "PL·PM·PO" },
    { id: "1000189", name: "컨설턴트" },
    { id: "1000190", name: "CEO·COO·CTO" },
    { id: "1000999", name: "기타" },
  ],
  "10027": [
    { id: "1000191", name: "경영지원" },
    { id: "1000192", name: "사무담당자" },
    { id: "1000193", name: "총무" },
    { id: "1000194", name: "사무보조" },
    { id: "1000195", name: "법무담당자" },
    { id: "1000196", name: "비서" },
    { id: "1000197", name: "변호사" },
    { id: "1000198", name: "법무사" },
    { id: "1000199", name: "변리사" },
    { id: "1000200", name: "노무사" },
    { id: "1000999", name: "기타" },
  ],
  "10028": [
    { id: "1000201", name: "인사담당자" },
    { id: "1000202", name: "HRD·HRM" },
    { id: "1000203", name: "노무관리자" },
    { id: "1000204", name: "잡매니저" },
    { id: "1000205", name: "헤드헌터" },
    { id: "1000206", name: "직업상담사" },
    { id: "1000999", name: "기타" },
  ],
  "10029": [
    { id: "1000207", name: "회계담당자" },
    { id: "1000208", name: "경리" },
    { id: "1000209", name: "세무담당자" },
    { id: "1000210", name: "재무담당자" },
    { id: "1000211", name: "감사" },
    { id: "1000212", name: "IR·공시" },
    { id: "1000213", name: "회계사" },
    { id: "1000214", name: "세무사" },
    { id: "1000215", name: "관세사" },
    { id: "1000999", name: "기타" },
  ],
  "10030": [
    { id: "1000216", name: "AE(광고기획자)" },
    { id: "1000217", name: "브랜드마케터" },
    { id: "1000218", name: "퍼포먼스마케터" },
    { id: "1000219", name: "CRM마케터" },
    { id: "1000220", name: "온라인마케터" },
    { id: "1000221", name: "콘텐츠마케터" },
    { id: "1000222", name: "홍보" },
    { id: "1000223", name: "설문·리서치" },
    { id: "1000224", name: "MD" },
    { id: "1000225", name: "카피라이터" },
    { id: "1000226", name: "크리에이티브디렉터" },
    { id: "1000227", name: "채널관리자" },
    { id: "1000228", name: "그로스해커" },
    { id: "1000999", name: "기타" },
  ],
  "10031": [
    { id: "1000229", name: "백엔드개발자" },
    { id: "1000230", name: "프론트엔드개발자" },
    { id: "1000231", name: "웹개발자" },
    { id: "1000232", name: "앱개발자" },
    { id: "1000233", name: "시스템엔지니어" },
    { id: "1000234", name: "네트워크엔지니어" },
    { id: "1000235", name: "DBA" },
    { id: "1000236", name: "데이터엔지니어" },
    { id: "1000237", name: "데이터사이언티스트" },
    { id: "1000238", name: "보안엔지니어" },
    { id: "1000239", name: "소프트웨어개발자" },
    { id: "1000240", name: "게임개발자" },
    { id: "1000241", name: "하드웨어개발자" },
    { id: "1000242", name: "머신러닝엔지니어" },
    { id: "1000243", name: "블록체인개발자" },
    { id: "1000244", name: "클라우드엔지니어" },
    { id: "1000245", name: "웹퍼블리셔" },
    { id: "1000246", name: "IT컨설팅" },
    { id: "1000247", name: "QA" },
  ],
  "10032": [
    { id: "1000248", name: "그래픽디자이너" },
    { id: "1000249", name: "3D디자이너" },
    { id: "1000250", name: "제품디자이너" },
    { id: "1000251", name: "산업디자이너" },
    { id: "1000252", name: "광고디자이너" },
    { id: "1000253", name: "시각디자이너" },
    { id: "1000254", name: "영상디자이너" },
    { id: "1000255", name: "웹디자이너" },
    { id: "1000256", name: "UI·UX디자이너" },
    { id: "1000257", name: "패션디자이너" },
    { id: "1000258", name: "편집디자이너" },
    { id: "1000259", name: "실내디자이너" },
    { id: "1000260", name: "공간디자이너" },
    { id: "1000261", name: "캐릭터디자이너" },
    { id: "1000262", name: "환경디자이너" },
    { id: "1000263", name: "아트디렉터" },
    { id: "1000264", name: "일러스트레이터" },
  ],
  "10033": [
    { id: "1000265", name: "물류관리자" },
    { id: "1000266", name: "구매관리자" },
    { id: "1000267", name: "자재관리자" },
    { id: "1000268", name: "유통관리자" },
    { id: "1000269", name: "무역사무원" },
    { id: "1000999", name: "기타" },
  ],
  "10034": [
    { id: "1000270", name: "납품·배송기사" },
    { id: "1000271", name: "배달기사" },
    { id: "1000272", name: "수행·운전기사" },
    { id: "1000273", name: "화물·중장비기사" },
    { id: "1000274", name: "버스기사" },
    { id: "1000275", name: "택시기사" },
    { id: "1000276", name: "조종·기관사" },
    { id: "1000999", name: "기타" },
  ],
  "10035": [
    { id: "1000277", name: "제품영업" },
    { id: "1000278", name: "서비스영업" },
    { id: "1000279", name: "해외영업" },
    { id: "1000280", name: "광고영업" },
    { id: "1000281", name: "금융영업" },
    { id: "1000282", name: "법인영업" },
    { id: "1000283", name: "IT·기술영업" },
    { id: "1000284", name: "영업관리" },
    { id: "1000285", name: "영업지원" },
    { id: "1000999", name: "기타" },
  ],
  "10036": [
    { id: "1000286", name: "인바운드상담원" },
    { id: "1000287", name: "아웃바운드상담원" },
    { id: "1000288", name: "고객센터관리자" },
    { id: "1000999", name: "기타" },
  ],
  "10037": [
    { id: "1000289", name: "금융사무" },
    { id: "1000290", name: "보험설계사" },
    { id: "1000291", name: "손해사정사" },
    { id: "1000292", name: "심사" },
    { id: "1000293", name: "은행원·텔러" },
    { id: "1000294", name: "계리사" },
    { id: "1000295", name: "펀드매니저" },
    { id: "1000296", name: "애널리스트" },
    { id: "1000999", name: "기타" },
  ],
  "10038": [
    { id: "1000297", name: "요리사" },
    { id: "1000298", name: "조리사" },
    { id: "1000299", name: "제과제빵사" },
    { id: "1000300", name: "바리스타" },
    { id: "1000301", name: "셰프·주방장" },
    { id: "1000302", name: "카페·레스토랑매니저" },
    { id: "1000303", name: "홀서버" },
    { id: "1000304", name: "주방보조" },
    { id: "1000305", name: "소믈리에·바텐더" },
    { id: "1000306", name: "영양사" },
    { id: "1000307", name: "식품연구원" },
    { id: "1000308", name: "푸드스타일리스트" },
  ],
  "10039": [
    { id: "1000309", name: "설치·수리기사" },
    { id: "1000310", name: "정비기사" },
    { id: "1000311", name: "호텔종사자" },
    { id: "1000312", name: "여행에이전트" },
    { id: "1000313", name: "매장관리자" },
    { id: "1000314", name: "뷰티·미용사" },
    { id: "1000315", name: "애견미용·훈련" },
    { id: "1000316", name: "안내데스크·리셉셔니스트" },
    { id: "1000317", name: "경호·경비" },
    { id: "1000318", name: "운영보조·매니저" },
    { id: "1000319", name: "이벤트·웨딩플래너" },
    { id: "1000320", name: "주차·주유원" },
    { id: "1000321", name: "스타일리스트" },
    { id: "1000322", name: "장례지도사" },
    { id: "1000323", name: "가사도우미" },
    { id: "1000324", name: "승무원" },
    { id: "1000325", name: "플로리스트" },
  ],
  "10040": [
    { id: "1000326", name: "전기·전자엔지니어" },
    { id: "1000327", name: "기계엔지니어" },
    { id: "1000328", name: "설계엔지니어" },
    { id: "1000329", name: "설비엔지니어" },
    { id: "1000330", name: "반도체엔지니어" },
    { id: "1000331", name: "화학엔지니어" },
    { id: "1000332", name: "공정엔지니어" },
    { id: "1000333", name: "하드웨어엔지니어" },
    { id: "1000334", name: "통신엔지니어" },
    { id: "1000335", name: "RF엔지니어" },
    { id: "1000336", name: "필드엔지니어" },
    { id: "1000337", name: "R&D·연구원" },
  ],
  "10041": [
    { id: "1000338", name: "생산직종사자" },
    { id: "1000339", name: "생산·공정관리자" },
    { id: "1000340", name: "품질관리자" },
    { id: "1000341", name: "포장·가공담당자" },
    { id: "1000342", name: "공장관리자" },
    { id: "1000343", name: "용접사" },
    { id: "1000999", name: "기타" },
  ],
  "10042": [
    { id: "1000344", name: "유치원·보육교사" },
    { id: "1000345", name: "학교·특수학교 교사" },
    { id: "1000346", name: "대학교수·강사" },
    { id: "1000347", name: "학원강사" },
    { id: "1000348", name: "외국어강사" },
    { id: "1000349", name: "기술·전문강사" },
    { id: "1000350", name: "학습지·방문교사" },
    { id: "1000351", name: "학원상담·운영" },
    { id: "1000352", name: "교직원·조교" },
    { id: "1000353", name: "교재개발·교수설계" },
  ],
  "10043": [
    { id: "1000354", name: "건축가" },
    { id: "1000355", name: "건축기사" },
    { id: "1000356", name: "시공기사" },
    { id: "1000357", name: "전기기사" },
    { id: "1000358", name: "토목기사" },
    { id: "1000359", name: "시설관리자" },
    { id: "1000360", name: "현장관리자" },
    { id: "1000361", name: "안전관리자" },
    { id: "1000362", name: "공무" },
    { id: "1000363", name: "소방설비" },
    { id: "1000364", name: "현장보조" },
    { id: "1000365", name: "감리원" },
    { id: "1000366", name: "도시·조경설계" },
    { id: "1000367", name: "환경기사" },
    { id: "1000368", name: "비파괴검사원" },
    { id: "1000369", name: "공인중개사" },
    { id: "1000370", name: "감정평가사" },
    { id: "1000371", name: "분양매니저" },
  ],
  "10044": [
    { id: "1000372", name: "의사" },
    { id: "1000373", name: "한의사" },
    { id: "1000374", name: "간호사" },
    { id: "1000375", name: "간호조무사" },
    { id: "1000376", name: "약사·한약사" },
    { id: "1000377", name: "의료기사" },
    { id: "1000378", name: "수의사" },
    { id: "1000379", name: "수의테크니션" },
    { id: "1000380", name: "병원코디네이터" },
    { id: "1000381", name: "원무행정" },
    { id: "1000382", name: "기타의료종사자" },
    { id: "1000383", name: "의료·약무보조" },
    { id: "1000384", name: "바이오·제약연구원" },
    { id: "1000385", name: "임상연구원" },
  ],
  "10045": [
    { id: "1000386", name: "PD·감독" },
    { id: "1000387", name: "포토그래퍼" },
    { id: "1000388", name: "영상편집자" },
    { id: "1000389", name: "사운드엔지니어" },
    { id: "1000390", name: "스태프" },
    { id: "1000391", name: "출판·편집" },
    { id: "1000392", name: "배급·제작자" },
    { id: "1000393", name: "콘텐츠에디터" },
    { id: "1000394", name: "크리에이터" },
    { id: "1000395", name: "기자" },
    { id: "1000396", name: "작가" },
    { id: "1000397", name: "아나운서" },
    { id: "1000398", name: "리포터·성우" },
    { id: "1000399", name: "MC·쇼호스트" },
    { id: "1000400", name: "모델" },
    { id: "1000401", name: "연예인·매니저" },
    { id: "1000402", name: "인플루언서" },
    { id: "1000403", name: "통번역사" },
    { id: "1000404", name: "큐레이터" },
    { id: "1000405", name: "음반기획" },
    { id: "1000406", name: "스포츠강사" },
  ],
  "10046": [
    { id: "1000407", name: "사회복지사" },
    { id: "1000408", name: "요양보호사" },
    { id: "1000409", name: "환경미화원" },
    { id: "1000410", name: "보건관리자" },
    { id: "1000411", name: "사서" },
    { id: "1000412", name: "자원봉사자" },
    { id: "1000413", name: "방역·방재기사" },
    { id: "1000999", name: "기타" },
  ],
}

// 리뷰 항목 데이터
const reviewItems = [
  {
    title: "근무환경/시설",
    description: "사무실 환경, 장비, 편의시설 등에 대해 평가해주세요.",
    type: "rating",
  },
  {
    title: "근무강도/스트레스",
    description: "업무량, 야근 빈도, 스트레스 정도 등을 평가해주세요.",
    type: "rating",
  },
  {
    title: "급여/복지",
    description: "급여 수준, 복리후생, 인센티브 등에 대해 평가해주세요.",
    type: "rating",
  },
  {
    title: "안정성/전망",
    description: "회사의 안정성과 미래 전망에 대해 평가해주세요.",
    type: "rating",
  },
  {
    title: "사람들",
    description: "동료, 상사와의 관계, 조직문화 등을 평가해주세요.",
    type: "rating",
  },
  {
    title: "취업준비",
    description: "이 회사 취업을 위한 준비 과정의 난이도를 평가해주세요.",
    type: "difficulty",
  },
  {
    title: "면접준비",
    description: "면접 과정의 난이도를 평가해주세요.",
    type: "difficulty",
  },
  {
    title: "이 곳에서 일하게 될 사람들에게 한마디",
    description: "앞으로 이 회사에서 일하게 될 분들에게 조언이나 당부의 말씀을 남겨주세요.",
    type: "text",
  },
]

export default function DemandReviewForm() {
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
    jobCategory: "",
    jobSubCategory: "",
    workStartYear: "",
    workStartMonth: "",
    workEndYear: "",
    workEndMonth: "",
    isCurrentJob: true,
    proofFile: null as File | null,
    reviews: {} as { [key: string]: { rating?: string; difficulty?: string; text: string } },
    agreePrivacy: false,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [shake, setShake] = useState(false)
  const [textCounts, setTextCounts] = useState<{ [key: string]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = (currentPage / 3) * 100

  // 다음 페이지로 이동
  const nextPage = () => {
    const validationErrors = validateCurrentPage()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setErrors([])
    setCurrentPage((prev) => Math.min(prev + 1, 3))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 이전 페이지로 이동
  const prevPage = () => {
    setErrors([]) // 에러 메시지 초기화
    setCurrentPage((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 현재 페이지 유효성 검사
  const validateCurrentPage = (): string[] => {
    const errors: string[] = []

    if (currentPage === 1) {
      if (!formData.name.trim()) errors.push("이름을 입력해주세요.")
      if (!formData.email.trim()) errors.push("이메일을 입력해주세요.")
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push("올바른 이메일 형식을 입력해주세요. (예: admin@domain.com)")
      }
      if (!formData.phone.trim()) errors.push("전화번호를 입력해주세요.")
      else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
        errors.push("올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)")
      }
      if (!formData.source) errors.push("접촉 경로를 선택해주세요.")
      if (!formData.education) errors.push("최종학력을 선택해주세요.")
      if (!formData.company.trim()) errors.push("회사명(근무지명)을 입력해주세요.")
      if (!formData.postcode) errors.push("사업장 주소를 입력해주세요.")
      if (!formData.detailAddress.trim()) errors.push("상세주소를 입력해주세요.")
      if (!formData.jobCategory) errors.push("직무 대분류를 선택해주세요.")
      if (!formData.jobSubCategory) errors.push("직무 소분류를 선택해주세요.")
      if (!formData.workStartYear || !formData.workStartMonth) {
        errors.push("근무 시작일을 입력해주세요.")
      }
      if (!formData.isCurrentJob && (!formData.workEndYear || !formData.workEndMonth)) {
        errors.push("근무 종료일을 입력해주세요.")
      }
      if (
        !formData.isCurrentJob &&
        formData.workStartYear &&
        formData.workStartMonth &&
        formData.workEndYear &&
        formData.workEndMonth
      ) {
        const startDate = new Date(
          Number.parseInt(formData.workStartYear),
          Number.parseInt(formData.workStartMonth) - 1,
        )
        const endDate = new Date(Number.parseInt(formData.workEndYear), Number.parseInt(formData.workEndMonth) - 1)
        if (endDate < startDate) {
          errors.push("근무 종료일이 시작일보다 빠를 수 없습니다.")
        }
      }
      if (!formData.agreePrivacy) errors.push("개인정보 수집 및 활용에 동의해주세요.")
    }

    if (currentPage === 3) {
      reviewItems.forEach((item) => {
        const review = formData.reviews[item.title]
        if (!review?.text || review.text.length < 50) {
          errors.push(`${item.title}: 상세 리뷰를 50자 이상 입력해주세요.`)
        }
        if (item.type === "rating" && !review?.rating) {
          errors.push(`${item.title}: 평가를 선택해주세요.`)
        }
        if (item.type === "difficulty" && !review?.difficulty) {
          errors.push(`${item.title}: 난이도를 선택해주세요.`)
        }
      })
    }

    return errors
  }

  // 주소 검색 (Daum Postcode API)
  const execDaumPostcode = () => {
    if (typeof window !== "undefined" && (window as any).daum) {
      ;new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          setFormData((prev) => ({
            ...prev,
            postcode: data.zonecode,
            roadAddress: data.roadAddress,
          }))
        },
      }).open()
    }
  }

  // 텍스트 카운트 업데이트
  const updateTextCount = (itemTitle: string, text: string) => {
    setTextCounts((prev) => ({
      ...prev,
      [itemTitle]: text.length,
    }))
  }

  // Netlify Forms 제출
  const handleSubmit = async () => {
    const validationErrors = validateCurrentPage()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    setIsSubmitting(true)

    try {
      // FormData 생성
      const formDataToSubmit = new FormData()

      // 기본 정보
      formDataToSubmit.append("form-name", "demand-review-form")
      formDataToSubmit.append("name", formData.name)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("phone", formData.phone)
      formDataToSubmit.append("source", formData.source)
      formDataToSubmit.append("education", formData.education)
      formDataToSubmit.append("company", formData.company)
      formDataToSubmit.append("postcode", formData.postcode)
      formDataToSubmit.append("roadAddress", formData.roadAddress)
      formDataToSubmit.append("detailAddress", formData.detailAddress)

      // 직무 정보
      const selectedCategory = jobCategories.find((cat) => cat.id === formData.jobCategory)
      const selectedSubCategory = jobSubCategories[formData.jobCategory]?.find(
        (sub) => sub.id === formData.jobSubCategory,
      )
      formDataToSubmit.append("jobCategory", selectedCategory?.name || "")
      formDataToSubmit.append("jobSubCategory", selectedSubCategory?.name || "")

      // 근무 기간
      formDataToSubmit.append("workStartYear", formData.workStartYear)
      formDataToSubmit.append("workStartMonth", formData.workStartMonth)
      formDataToSubmit.append("workEndYear", formData.workEndYear)
      formDataToSubmit.append("workEndMonth", formData.workEndMonth)
      formDataToSubmit.append("isCurrentJob", formData.isCurrentJob ? "예" : "아니오")

      // 증빙 파일
      if (formData.proofFile) {
        formDataToSubmit.append("proofFile", formData.proofFile)
      }

      // 리뷰 데이터
      reviewItems.forEach((item) => {
        const review = formData.reviews[item.title]
        if (review) {
          if (item.type === "rating") {
            formDataToSubmit.append(`${item.title}_rating`, review.rating || "")
          }
          if (item.type === "difficulty") {
            formDataToSubmit.append(`${item.title}_difficulty`, review.difficulty || "")
          }
          formDataToSubmit.append(`${item.title}_text`, review.text || "")
        }
      })

      // Netlify Forms로 제출
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSubmit as any).toString(),
      })

      if (response.ok) {
        alert("제출이 완료되었습니다! 감사합니다.")
        // 폼 초기화
        setFormData({
          name: "",
          email: "",
          phone: "",
          source: "",
          education: "",
          company: "",
          postcode: "",
          roadAddress: "",
          detailAddress: "",
          jobCategory: "",
          jobSubCategory: "",
          workStartYear: "",
          workStartMonth: "",
          workEndYear: "",
          workEndMonth: "",
          isCurrentJob: true,
          proofFile: null,
          reviews: {},
          agreePrivacy: false,
        })
        setCurrentPage(1)
        setTextCounts({})
      } else {
        throw new Error("제출에 실패했습니다.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Daum Postcode API 로드
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Netlify Forms를 위한 숨겨진 폼 */}
        <form name="demand-review-form" netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="tel" name="phone" />
          <input type="text" name="source" />
          <input type="text" name="education" />
          <input type="text" name="company" />
          <input type="text" name="postcode" />
          <input type="text" name="roadAddress" />
          <input type="text" name="detailAddress" />
          <input type="text" name="jobCategory" />
          <input type="text" name="jobSubCategory" />
          <input type="text" name="workStartYear" />
          <input type="text" name="workStartMonth" />
          <input type="text" name="workEndYear" />
          <input type="text" name="workEndMonth" />
          <input type="text" name="isCurrentJob" />
          <input type="file" name="proofFile" />
          {reviewItems.map((item) => (
            <div key={item.title}>
              {item.type === "rating" && <input type="text" name={`${item.title}_rating`} />}
              {item.type === "difficulty" && <input type="text" name={`${item.title}_difficulty`} />}
              <textarea name={`${item.title}_text`}></textarea>
            </div>
          ))}
        </form>

        <Card className={`${shake ? "animate-pulse" : ""}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">근무 후기 이벤트 참여</CardTitle>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">{currentPage} / 3</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 에러 메시지 */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* 1페이지: 기본 정보 */}
            {currentPage === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="이름을 입력해주세요"
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@domain.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <Label>어떤 경로로 후기 이벤트를 접하게 되었나요? *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
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

                <div>
                  <Label>최종학력 *</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, education: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="고졸">고졸</SelectItem>
                      <SelectItem value="초대졸">초대졸</SelectItem>
                      <SelectItem value="대졸">대졸</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="company">회사명(근무지명) *</Label>
                  <p className="text-xs text-gray-500 mb-2">가능한 줄임 없이 풀어서 써주세요 (하닉 → SK하이닉스)</p>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="회사명(근무지명)을 입력해주세요"
                  />
                </div>

                <div>
                  <Label>사업장 주소 *</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={formData.postcode} placeholder="우편번호" readOnly />
                    <Button type="button" onClick={execDaumPostcode} variant="outline">
                      주소 찾기
                    </Button>
                  </div>
                  <Input value={formData.roadAddress} placeholder="도로명 주소" readOnly className="mb-2" />
                  <Input
                    value={formData.detailAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, detailAddress: e.target.value }))}
                    placeholder="상세주소 입력"
                  />
                </div>

                <div>
                  <Label>직무 대분류 *</Label>
                  <Select
                    value={formData.jobCategory}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobCategory: value,
                        jobSubCategory: "", // 대분류 변경시 소분류 초기화
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>직무 소분류 *</Label>
                  <Select
                    value={formData.jobSubCategory}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jobSubCategory: value }))}
                    disabled={!formData.jobCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="대분류를 먼저 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.jobCategory &&
                        jobSubCategories[formData.jobCategory]?.map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>근무 기간 *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">시작일</p>
                      <div className="flex gap-2">
                        <Select
                          value={formData.workStartYear}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, workStartYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="년도" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}년
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={formData.workStartMonth}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, workStartMonth: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="월" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {month}월
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">종료일</p>
                      {!formData.isCurrentJob && (
                        <div className="flex gap-2 mb-2">
                          <Select
                            value={formData.workEndYear}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, workEndYear: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="년도" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}년
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={formData.workEndMonth}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, workEndMonth: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="월" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <SelectItem key={month} value={month.toString()}>
                                  {month}월
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="currentJob"
                          checked={formData.isCurrentJob}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isCurrentJob: checked as boolean,
                              workEndYear: checked ? "" : prev.workEndYear,
                              workEndMonth: checked ? "" : prev.workEndMonth,
                            }))
                          }
                        />
                        <Label htmlFor="currentJob" className="text-sm">
                          현재 재직중
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreePrivacy: checked as boolean }))
                    }
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    개인정보 수집 및 활용에 동의합니다. (개인정보는 수집만 하고 어디에 노출되지 않습니다) *
                  </Label>
                </div>

                <Button onClick={nextPage} className="w-full">
                  다음 (1/3)
                </Button>
              </div>
            )}

            {/* 2페이지: 현직자 인증 */}
            {currentPage === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">현직자 인증</h3>
                  <p className="text-gray-600 mb-4">
                    증빙 자료를 첨부해주세요. 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로 포함됩니다. 하지만, 증빙
                    자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히 인정되면 이벤트 보상 제공 대상에
                    포함될 수 있습니다.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      증빙자료를 업로드해주세요
                      <br />
                      (예: 사원증, 사내 시스템 화면 등 / 이미지 또는 PDF 파일, 15일 이내 자동 삭제됩니다)
                    </p>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setFormData((prev) => ({ ...prev, proofFile: e.target.files?.[0] || null }))}
                      className="max-w-xs mx-auto"
                    />
                    {formData.proofFile && (
                      <p className="text-sm text-green-600 mt-2">선택된 파일: {formData.proofFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={prevPage} variant="outline" className="flex-1 bg-transparent">
                    이전
                  </Button>
                  <Button onClick={nextPage} className="flex-1">
                    다음 (2/3)
                  </Button>
                </div>
              </div>
            )}

            {/* 3페이지: 상세 리뷰 */}
            {currentPage === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">현직자 상세 리뷰</h3>

                {reviewItems.map((item, index) => (
                  <div key={item.title} className="space-y-3 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {index + 1}. {item.title} *
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    {item.type === "rating" && (
                      <div>
                        <Label className="text-sm">평가</Label>
                        <Select
                          value={formData.reviews[item.title]?.rating || ""}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              reviews: {
                                ...prev.reviews,
                                [item.title]: { ...prev.reviews[item.title], rating: value },
                              },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="평가를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5점 (매우 좋음)</SelectItem>
                            <SelectItem value="4">4점 (좋음)</SelectItem>
                            <SelectItem value="3">3점 (보통)</SelectItem>
                            <SelectItem value="2">2점 (나쁨)</SelectItem>
                            <SelectItem value="1">1점 (매우 나쁨)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {item.type === "difficulty" && (
                      <div>
                        <Label className="text-sm">난이도 평가</Label>
                        <Select
                          value={formData.reviews[item.title]?.difficulty || ""}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              reviews: {
                                ...prev.reviews,
                                [item.title]: { ...prev.reviews[item.title], difficulty: value },
                              },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="난이도를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (쉬움)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4 (어려움)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm">상세 리뷰 *</Label>
                      <Textarea
                        rows={4}
                        value={formData.reviews[item.title]?.text || ""}
                        onChange={(e) => {
                          const text = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            reviews: {
                              ...prev.reviews,
                              [item.title]: { ...prev.reviews[item.title], text },
                            },
                          }))
                          updateTextCount(item.title, text)
                        }}
                        placeholder="최소 50자 이상 입력해주세요"
                        className="resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">{textCounts[item.title] || 0}/50자 이상</p>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button onClick={prevPage} variant="outline" className="flex-1 bg-transparent">
                    이전
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "제출 중..." : "제출하기"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
