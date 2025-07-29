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

// Job categories based on JobKorea classification
const jobCategories = {
  서비스업: [
    "호텔·여행·항공",
    "스포츠·여가·레저",
    "음식료·외식·프랜차이즈",
    "뷰티·미용",
    "콜센터·아웃소싱·기타",
    "정비·A/S·카센터",
    "렌탈·임대·리스",
    "서치펌·헤드헌팅",
    "시설관리·빌딩·경비",
    "웨딩·상조·이벤트",
  ],
  금융·은행업: ["은행·금융", "캐피탈·대출", "증권·보험·카드"],
  건설업: ["부동산·중개·임대", "건축·설비·환경", "건설·시공·토목·조경", "인테리어·자재"],
  의료·제약업: ["의료(간호·원무·상담)", "의료(병원분류별)", "의료(진료과별)", "제약·보건·바이오", "사회복지·요양"],
  미디어·광고업: [
    "방송·케이블·프로덕션",
    "신문·잡지·언론사",
    "광고·홍보·전시",
    "영화·음반·배급",
    "연예·엔터테인먼트",
    "출판·인쇄·사진",
  ],
  문화·예술·디자인업: ["문화·공연·예술", "디자인·CAD"],
  IT·정보통신업: [
    "솔루션·SI·CRM·ERP",
    "웹에이전시",
    "쇼핑몰·오픈마켓·소셜커머스",
    "포털·컨텐츠·커뮤니티",
    "네트워크·통신서비스",
    "정보보안",
    "컴퓨터·하드웨어·장비",
    "게임·애니메이션",
    "모바일·APP",
    "IT컨설팅",
  ],
  기관·협회: ["공기업·공공기관", "협회·단체", "컨설팅·연구·조사", "회계·세무·법무"],
  제조·생산·화학업: [
    "전기·전자·제어",
    "반도체·디스플레이·광학",
    "기계·기계설비",
    "자동차·조선·철강·항공",
    "금속·재료·자재",
    "화학·에너지·환경",
    "섬유·의류·패션",
    "생활화학·화장품",
    "생활용품·소비재·기타",
    "목재·제지·가구",
    "식품가공",
    "농축산·어업·임업",
  ],
  판매·유통업: ["물류·운송·배송", "무역·상사", "백화점·유통·도소매"],
  교육업: ["학교(초·중·고·대학·특수)", "유아·유치원·어린이집", "학원·어학원·교육원", "학습지·방문교육"],
  기획·전략: ["경영·비즈니스기획", "웹기획", "마케팅기획", "PL·PM·PO", "컨설턴트", "CEO·COO·CTO"],
  법무·사무·총무: [
    "경영지원",
    "사무담당자",
    "총무",
    "사무보조",
    "법무담당자",
    "비서",
    "변호사",
    "법무사",
    "변리사",
    "노무사",
  ],
  인사·HR: ["인사담당자", "HRD·HRM", "노무관리자", "잡매니저", "헤드헌터", "직업상담사"],
  회계·세무: ["회계담당자", "경리", "세무담당자", "재무담당자", "감사", "IR·공시", "회계사", "세무사", "관세사"],
  마케팅·광고·MD: [
    "AE(광고기획자)",
    "브랜드마케터",
    "퍼포먼스마케터",
    "CRM마케터",
    "온라인마케터",
    "콘텐츠마케터",
    "홍보",
    "설문·리서치",
    "MD",
    "카피라이터",
    "크리에이티브디렉터",
    "채널관리자",
    "그로스해커",
  ],
  개발·데이터: [
    "백엔드개발자",
    "프론트엔드개발자",
    "웹개발자",
    "앱개발자",
    "시스템엔지니어",
    "네트워크엔지니어",
    "DBA",
    "데이터엔지니어",
    "데이터사이언티스트",
    "보안엔지니어",
    "소프트웨어개발자",
    "게임개발자",
    "하드웨어개발자",
    "머신러닝엔지니어",
    "블록체인개발자",
    "클라우드엔지니어",
    "웹퍼블리셔",
    "IT컨설팅",
    "QA",
  ],
  디자인: [
    "그래픽디자이너",
    "3D디자이너",
    "제품디자이너",
    "산업디자이너",
    "광고디자이너",
    "시각디자이너",
    "영상디자이너",
    "웹디자이너",
    "UI·UX디자이너",
    "패션디자이너",
    "편집디자이너",
    "실내디자이너",
    "공간디자이너",
    "캐릭터디자이너",
    "환경디자이너",
    "아트디렉터",
    "일러스트레이터",
  ],
  물류·무역: ["물류관리자", "구매관리자", "자재관리자", "유통관리자", "무역사무원"],
  운전·운송·배송: [
    "납품·배송기사",
    "배달기사",
    "수행·운전기사",
    "화물·중장비기사",
    "버스기사",
    "택시기사",
    "조종·기관사",
  ],
  영업: [
    "제품영업",
    "서비스영업",
    "해외영업",
    "광고영업",
    "금융영업",
    "법인영업",
    "IT·기술영업",
    "영업관리",
    "영업지원",
  ],
  고객상담·TM: ["인바운드상담원", "아웃바운드상담원", "고객센터관리자"],
  금융·보험: ["금융사무", "보험설계사", "손해사정사", "심사", "은행원·텔러", "계리사", "펀드매니저", "애널리스트"],
  식·음료: [
    "요리사",
    "조리사",
    "제과제빵사",
    "바리스타",
    "셰프·주방장",
    "카페·레스토랑매니저",
    "홀서버",
    "주방보조",
    "소믈리에·바텐더",
    "영양사",
    "식품연구원",
    "푸드스타일리스트",
  ],
  고객서비스·리테일: [
    "설치·수리기사",
    "정비기사",
    "호텔종사자",
    "여행에이전트",
    "매장관리자",
    "뷰티·미용사",
    "애견미용·훈련",
    "안내데스크·리셉셔니스트",
    "경호·경비",
    "운영보조·매니저",
    "이벤트·웨딩플래너",
    "주차·주유원",
    "스타일리스트",
    "장례지도사",
    "가사도우미",
    "승무원",
    "플로리스트",
  ],
  엔지니어링·설계: [
    "전기·전자엔지니어",
    "기계엔지니어",
    "설계엔지니어",
    "설비엔지니어",
    "반도체엔지니어",
    "화학엔지니어",
    "공정엔지니어",
    "하드웨어엔지니어",
    "통신엔지니어",
    "RF엔지니어",
    "필드엔지니어",
    "R&D·연구원",
  ],
  제조·생산: ["생산직종사자", "생산·공정관리자", "품질관리자", "포장·가공담당자", "공장관리자", "용접사"],
  교육: [
    "유치원·보육교사",
    "학교·특수학교 교사",
    "대학교수·강사",
    "학원강사",
    "외국어강사",
    "기술·전문강사",
    "학습지·방문교사",
    "학원상담·운영",
    "교직원·조교",
    "교재개발·교수설계",
  ],
  건축·시설: [
    "건축가",
    "건축기사",
    "시공기사",
    "전기기사",
    "토목기사",
    "시설관리자",
    "현장관리자",
    "안전관리자",
    "공무",
    "소방설비",
    "현장보조",
    "감리원",
    "도시·조경설계",
    "환경기사",
    "비파괴검사원",
    "공인중개사",
    "감정평가사",
    "분양매니저",
  ],
  의료·바이오: [
    "의사",
    "한의사",
    "간호사",
    "간호조무사",
    "약사·한약사",
    "의료기사",
    "수의사",
    "수의테크니션",
    "병원코디네이터",
    "원무행정",
    "기타의료종사자",
    "의료·약무보조",
    "바이오·제약연구원",
    "임상연구원",
  ],
  미디어·문화·스포츠: [
    "PD·감독",
    "포토그래퍼",
    "영상편집자",
    "사운드엔지니어",
    "스태프",
    "출판·편집",
    "배급·제작자",
    "콘텐츠에디터",
    "크리에이터",
    "기자",
    "작가",
    "아나운서",
    "리포터·성우",
    "MC·쇼호스트",
    "모델",
    "연예인·매니저",
    "인플루언서",
    "통번역사",
    "큐레이터",
    "음반기획",
    "스포츠강사",
  ],
  공공·복지: ["사회복지사", "요양보호사", "환경미화원", "보건관리자", "사서", "자원봉사자", "방역·방재기사"],
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
    alert("제출 완료!")
  }

  const progressWidth = (currentPage / 3) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold text-center mb-4">근무 후기 이벤트 참여</h1>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <div className="text-center text-gray-600 mb-8">{currentPage} / 3</div>

            {/* Page 1: Basic Information */}
            {currentPage === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  nextPage()
                }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>어떤 경로로 후기 이벤트를 접하게 되었나요?</Label>
                  <Select value={formData.source} onValueChange={(value) => updateFormData("source", value)}>
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
                  <Label>최종학력</Label>
                  <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
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
                  <Label htmlFor="company">회사명(근무지명)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">가능한 줄임 없이 풀어서 써주세요 (하닉 → SK하이닉스)</p>
                </div>

                <div>
                  <Label>사업장 주소</Label>
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="우편번호" value={formData.postcode} readOnly required />
                    <Button type="button" variant="outline">
                      주소 찾기
                    </Button>
                  </div>
                  <Input placeholder="도로명 주소" value={formData.roadAddress} readOnly required className="mb-2" />
                  <Input
                    placeholder="상세주소 입력"
                    value={formData.detailAddress}
                    onChange={(e) => updateFormData("detailAddress", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>근무 형태</Label>
                  <Select value={formData.workType} onValueChange={(value) => updateFormData("workType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="현직장">현직장</SelectItem>
                      <SelectItem value="전직장">전직장</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>근무 기간</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">시작</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.workStartYear}
                          onValueChange={(value) => updateFormData("workStartYear", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="년도" />
                          </SelectTrigger>
                          <SelectContent>
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
                      <Label className="text-sm text-gray-600">종료 (현직장인 경우 현재)</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.workEndYear}
                          onValueChange={(value) => updateFormData("workEndYear", value)}
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
                          onValueChange={(value) => updateFormData("workEndMonth", value)}
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
                  </div>
                </div>

                <div>
                  <Label>직무 (대분류)</Label>
                  <Select
                    value={formData.majorCategory}
                    onValueChange={(value) => {
                      updateFormData("majorCategory", value)
                      updateFormData("minorCategory", "")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(jobCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.majorCategory && (
                  <div>
                    <Label>직무 (소분류)</Label>
                    <Select
                      value={formData.minorCategory}
                      onValueChange={(value) => updateFormData("minorCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="소분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories[formData.majorCategory].map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
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

                <Button type="submit" className="w-full">
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => updateFormData("proofFile", e.target.files?.[0] || null)}
                      className="block mx-auto"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      예: 사원증, 사내 시스템 화면 등 / 이미지 또는 PDF 파일
                      <br />
                      15일 이내 자동 삭제됩니다
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
                    <div key={item.id} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.id}. {item.title}
                      </h3>
                      {item.subtitle && <p className="text-sm text-gray-600 mb-4">{item.subtitle}</p>}

                      {item.type === "rating" && (
                        <div className="mb-4">
                          <Label className="block mb-2">평점 평가</Label>
                          <Select
                            value={formData.reviews[item.id]?.rating || ""}
                            onValueChange={(value) => updateReviewData(item.id, "rating", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="평점을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="난이도를 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
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
                          className="resize-vertical"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {(formData.reviews[item.id]?.review || "").length}/50자 (최소 50자)
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={prevPage} className="flex-1 bg-transparent">
                      이전
                    </Button>
                    <Button type="submit" className="flex-1">
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
