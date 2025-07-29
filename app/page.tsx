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

// Job categories based on JobKorea API classification
const jobCategories = {
  경영·사무: ["기획·전략", "법무·사무·총무", "인사·HR", "회계·세무", "마케팅·광고·MD"],
  IT·인터넷: ["개발·데이터", "디자인", "물류·무역"],
  전문직: ["운전·운송·배송", "영업", "고객상담·TM", "금융·보험"],
  서비스: ["식·음료", "고객서비스·리테일"],
  생산: ["엔지니어링·설계", "제조·생산"],
  교육: ["교육"],
  건설: ["건축·시설"],
  의료: ["의료·바이오"],
  미디어: ["미디어·문화·스포츠"],
  공공·복지: ["공공·복지"],
  영업·판매·무역: ["기업영업", "개인영업", "매장관리·판매", "온라인·모바일판매", "무역·해외영업", "영업기획·관리·지원"],
  고객상담·리테일: ["고객상담·CS", "리테일·판매직", "매장관리·운영"],
  운전·배송·물류: ["운전·운송", "택배·배송·배달", "물류·창고관리"],
  서비스업: ["외식·식음료", "호텔·여행·항공", "뷰티·미용", "스포츠·레저", "청소·경비·시설관리", "돌봄·케어서비스"],
  생산·제조: ["제조·생산직", "설비·보전·정비", "품질관리·안전관리"],
  건설·건축: ["건축·토목·조경", "전기·소방·통신", "건설기계·중장비"],
  의료·간병·미용: ["의료진", "간병·요양", "미용·에스테틱"],
  교육·강사: ["학교·학원강사", "교육기획·관리"],
  디자인·출판·영상: ["디자인", "출판·편집", "영상·사진"],
  IT·개발·데이터: [
    "웹개발·퍼블리싱",
    "앱개발",
    "시스템·네트워크",
    "데이터·AI",
    "정보보안",
    "하드웨어·임베디드",
    "게임개발",
  ],
  기획·마케팅: ["상품기획·MD", "마케팅·PR", "광고·카피라이터", "브랜드·컨텐츠마케팅"],
  인사·총무·법무: ["인사·HR", "총무·사무", "법무·특허·노무", "회계·세무·재무"],
  금융·보험: ["은행·금융", "증권·투자", "보험"],
  공공·복지: ["공무원", "사회복지", "국방·보안"],
  농림어업: ["농업·축산업", "임업·광업", "어업·수산업"],
  기타: ["단순노무직", "기타"],
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
                  <Label className="text-sm sm:text-base font-medium text-gray-700">직무 (대분류)</Label>
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
                    <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                      {Object.keys(jobCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.majorCategory && (
                  <div className="space-y-1.5">
                    <Label className="text-sm sm:text-base font-medium text-gray-700">직무 (소분류)</Label>
                    <Select
                      value={formData.minorCategory}
                      onValueChange={(value) => updateFormData("minorCategory", value)}
                    >
                      <SelectTrigger className="h-11 sm:h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="소분류 선택" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-gray-200 shadow-lg">
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
