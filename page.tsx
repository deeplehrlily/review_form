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
  경영·비즈니스: ["기획·전략", "마케팅·광고·MD", "인사·HR", "총무·법무·사무", "컨설팅·리서치"],
  개발·데이터: ["웹개발", "앱개발", "게임개발", "데이터·AI", "DevOps·인프라"],
  디자인: ["UX·UI·GUI", "그래픽디자인·CG", "제품·산업디자인", "패션·의류", "영상·편집·모션그래픽"],
  제조·생산: ["생산관리·품질관리", "설비·기계", "전기·전자", "화학·에너지", "자동차·조선·항공"],
  의료·바이오: ["의료진·간호사", "바이오·제약·식품", "의료기기", "헬스케어"],
  교육: ["유치원·초중고", "대학교·대학원", "학원강사·교육", "에듀테크"],
  금융·보험: ["은행·증권", "보험", "투자·자산관리", "핀테크"],
  미디어·문화·스포츠: ["방송·언론", "광고·홍보", "문화·예술·디자인", "스포츠·레저"],
  서비스: ["고객상담·TM", "서비스기획·운영", "외식·식음료", "뷰티·웰니스"],
  유통·물류: ["유통·백화점·매장관리", "구매·자재·물류", "운송·배송"],
  건설·건축: ["건축·설계", "토목·조경", "건설·시공", "부동산"],
  공공·복지: ["공무원", "사회복지", "보건·의료행정"],
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
