"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Job categories data
const majorCategories = [
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

const minorCategories: { [key: string]: { id: string; name: string }[] } = {
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
  ],
  "10003": [
    { id: "1000017", name: "부동산·중개·임대" },
    { id: "1000018", name: "건축·설비·환경" },
    { id: "1000019", name: "건설·시공·토목·조경" },
    { id: "1000020", name: "인테리어·자재" },
  ],
  "10004": [
    { id: "1000025", name: "의료(간호·원무·상담)" },
    { id: "1000026", name: "의료(병원분류별)" },
    { id: "1000027", name: "의료(진료과별)" },
    { id: "1000028", name: "제약·보건·바이오" },
    { id: "1000029", name: "사회복지·요양" },
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
}

const reviewItems = [
  {
    title: "근무환경/시설",
    subtitle: "사무실 환경, 편의 시설, 장비/시설 등",
    description:
      "사무실이 쾌적하고 근무 환경이 좋은지, 휴게 공간이나 카페테리아 등의 편의시설이 잘 갖춰져 있는지, 업무에 필요한 장비나 시설이 충분한지 등을 평가해 주세요.",
  },
  {
    title: "근무강도/스트레스",
    subtitle: "업무량, 야근, 스트레스 정도 등",
    description:
      "업무량이 적절한지, 야근이나 주말 근무는 얼마나 자주 있는지, 업무로 인한 스트레스는 어느 정도인지 등을 평가해 주세요.",
  },
  {
    title: "급여/복지",
    subtitle: "급여, 복지, 휴가, 인센티브 등",
    description:
      "급여가 업계 평균 대비 어느 정도인지, 복지 혜택(건강보험, 퇴직금, 각종 수당 등)은 어떤지, 휴가 사용이 자유로운지, 성과에 따른 인센티브나 승진 기회는 어떤지 등을 평가해 주세요.",
  },
  {
    title: "안정성/전망",
    subtitle: "회사 안정성, 성장 가능성, 전망 등",
    description:
      "회사가 안정적으로 운영되고 있는지, 앞으로의 성장 가능성은 어떤지, 업계 내에서의 위치나 경쟁력은 어떤지, 장기적으로 다닐 만한 회사인지 등을 평가해 주세요.",
  },
  {
    title: "사람들",
    subtitle: "동료, 상사, 회사 분위기 등",
    description:
      "동료들과의 관계는 어떤지, 상사나 관리자들은 어떤지, 전반적인 회사 분위기나 문화는 어떤지, 소통이 원활한지 등을 평가해 주세요.",
  },
  {
    title: "취업준비",
    subtitle: "취업 준비, 스펙, 경쟁률 등",
    isDifficulty: true,
    description:
      "이 회사에 취업하기 위해 어떤 준비가 필요한지, 어느 정도의 스펙이나 경력이 요구되는지, 경쟁률은 어떤지 등을 난이도로 평가해 주세요.",
  },
  {
    title: "면접준비",
    subtitle: "면접 과정, 질문, 분위기 등",
    isDifficulty: true,
    description:
      "면접 과정은 어떻게 진행되는지, 어떤 질문들이 나오는지, 면접 분위기는 어떤지, 면접 준비는 어떻게 해야 하는지 등을 난이도로 평가해 주세요.",
  },
  {
    title: "이 곳에서 일하게 될 사람들에게 한마디",
    subtitle: "",
    isAdvice: true,
    description: "앞으로 이 회사에서 일하게 될 사람들에게 조언이나 당부하고 싶은 말씀을 자유롭게 작성해 주세요.",
  },
]

export default function WorkReviewForm() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isCurrentJob, setIsCurrentJob] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const [characterCounts, setCharacterCounts] = useState<{ [key: string]: number }>({})
  const [selectedMajorCategory, setSelectedMajorCategory] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  const validatePage = (page: number) => {
    const newErrors: string[] = []
    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return false

    const formData = new FormData(form)

    if (page === 1) {
      if (!formData.get("name")) newErrors.push("이름을 입력해주세요.")
      if (!formData.get("email")) newErrors.push("이메일을 입력해주세요.")
      else if (!validateEmail(formData.get("email") as string))
        newErrors.push("올바른 이메일 형식을 입력해주세요. (예: admin@domain.com)")
      if (!formData.get("phone")) newErrors.push("전화번호를 입력해주세요.")
      else if (!validatePhone(formData.get("phone") as string))
        newErrors.push("올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)")
      if (!formData.get("source")) newErrors.push("접하게 된 경로를 선택해주세요.")
      if (!formData.get("education")) newErrors.push("최종학력을 선택해주세요.")
      if (!formData.get("company")) newErrors.push("회사명을 입력해주세요.")
      if (!formData.get("postcode") || !formData.get("roadAddress") || !formData.get("detailAddress"))
        newErrors.push("사업장 주소를 입력해주세요.")
      if (!formData.get("majorCategory")) newErrors.push("직무 대분류를 선택해주세요.")
      if (!formData.get("minorCategory")) newErrors.push("직무 소분류를 선택해주세요.")
      if (!formData.get("workStartYear") || !formData.get("workStartMonth"))
        newErrors.push("근무 시작일을 입력해주세요.")
      if (!isCurrentJob && (!formData.get("workEndYear") || !formData.get("workEndMonth")))
        newErrors.push("근무 종료일을 입력해주세요.")
      if (!formData.get("privacyConsent")) newErrors.push("개인정보 수집 및 활용에 동의해주세요.")
    }

    if (page === 3) {
      reviewItems.forEach((item) => {
        if (!item.isAdvice && !formData.get(`${item.title}-rating`)) {
          newErrors.push(`${item.title} 평가를 선택해주세요.`)
        }
        const detail = formData.get(`${item.title}-detail`) as string
        if (!detail || detail.length < 50) {
          newErrors.push(`${item.title} 상세 리뷰를 50자 이상 입력해주세요.`)
        }
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (validatePage(currentPage)) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    setCurrentPage(currentPage - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePage(3)) {
      // Netlify Forms will handle the submission
      const form = e.target as HTMLFormElement
      form.submit()
    }
  }

  const handleCharacterCount = (title: string, value: string) => {
    setCharacterCounts((prev) => ({
      ...prev,
      [title]: value.length,
    }))
  }

  const openDaumPostcode = () => {
    if (typeof window !== "undefined" && (window as any).daum) {
      ;new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          const postcodeInput = document.querySelector('input[name="postcode"]') as HTMLInputElement
          const roadAddressInput = document.querySelector('input[name="roadAddress"]') as HTMLInputElement
          if (postcodeInput) postcodeInput.value = data.zonecode
          if (roadAddressInput) roadAddressInput.value = data.roadAddress
        },
      }).open()
    }
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">근무 후기 이벤트 참여</CardTitle>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentPage / 3) * 100}%` }}
              />
            </div>
            <p className="text-gray-600 mt-2">{currentPage} / 3</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form name="work-review" method="POST" data-netlify="true" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="work-review" />

              {/* Page 1 - Basic Information */}
              {currentPage === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름 *</Label>
                    <Input id="name" name="name" placeholder="이름을 입력해주세요" required />
                  </div>

                  <div>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input id="email" name="email" type="email" placeholder="admin@domain.com" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">전화번호 *</Label>
                    <Input id="phone" name="phone" placeholder="010-0000-0000" required />
                  </div>

                  <div>
                    <Label htmlFor="source">어떤 경로로 후기 이벤트를 접하게 되었나요? *</Label>
                    <select name="source" required className="w-full p-2 border rounded-md">
                      <option value="">선택해주세요</option>
                      <option value="디맨드 홈페이지">디맨드 홈페이지</option>
                      <option value="디맨드 인스타그램">디맨드 인스타그램</option>
                      <option value="디맨드 스레드">디맨드 스레드</option>
                      <option value="디맨드 오픈채팅방">디맨드 오픈채팅방</option>
                      <option value="인스타그램 광고">인스타그램 광고</option>
                      <option value="디맨드 블로그">디맨드 블로그</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="education">최종학력 *</Label>
                    <select name="education" required className="w-full p-2 border rounded-md">
                      <option value="">선택해주세요</option>
                      <option value="고졸">고졸</option>
                      <option value="초대졸">초대졸</option>
                      <option value="대졸">대졸</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="company">회사명(근무지명) *</Label>
                    <p className="text-xs text-gray-400 mb-2">가능한 줄임 없이 풀어서 써주세요 (하닉 → SK하이닉스)</p>
                    <Input id="company" name="company" placeholder="회사명을 입력해주세요" required />
                  </div>

                  <div>
                    <Label>사업장 주소 *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input name="postcode" placeholder="우편번호" readOnly required />
                      <Button type="button" onClick={openDaumPostcode} variant="outline">
                        주소 찾기
                      </Button>
                    </div>
                    <Input name="roadAddress" placeholder="도로명 주소" readOnly required className="mb-2" />
                    <Input name="detailAddress" placeholder="상세주소 입력" required />
                  </div>

                  <div>
                    <Label htmlFor="majorCategory">직무 대분류 *</Label>
                    <select
                      name="majorCategory"
                      required
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        setSelectedMajorCategory(e.target.value)
                        // 소분류 초기화
                        const minorSelect = document.querySelector('select[name="minorCategory"]') as HTMLSelectElement
                        if (minorSelect) minorSelect.value = ""
                      }}
                    >
                      <option value="">대분류를 선택해주세요</option>
                      {majorCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="minorCategory">직무 소분류 *</Label>
                    <select
                      name="minorCategory"
                      required
                      className="w-full p-2 border rounded-md"
                      disabled={!selectedMajorCategory}
                    >
                      <option value="">소분류를 선택해주세요</option>
                      {selectedMajorCategory &&
                        minorCategories[selectedMajorCategory]?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <Label>근무 기간 *</Label>
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label className="text-sm">시작일</Label>
                        <div className="flex gap-2">
                          <select name="workStartYear" required className="flex-1 p-2 border rounded-md">
                            <option value="">년도</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}년
                              </option>
                            ))}
                          </select>
                          <select name="workStartMonth" required className="flex-1 p-2 border rounded-md">
                            <option value="">월</option>
                            {months.map((month) => (
                              <option key={month} value={month}>
                                {month}월
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="currentJob"
                          name="isCurrentJob"
                          checked={isCurrentJob}
                          onChange={(e) => setIsCurrentJob(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="currentJob" className="text-sm">
                          현재 재직중
                        </Label>
                      </div>

                      {!isCurrentJob && (
                        <div>
                          <Label className="text-sm">종료일</Label>
                          <div className="flex gap-2">
                            <select name="workEndYear" className="flex-1 p-2 border rounded-md">
                              <option value="">년도</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}년
                                </option>
                              ))}
                            </select>
                            <select name="workEndMonth" className="flex-1 p-2 border rounded-md">
                              <option value="">월</option>
                              {months.map((month) => (
                                <option key={month} value={month}>
                                  {month}월
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="privacy" name="privacyConsent" required className="rounded" />
                    <Label htmlFor="privacy" className="text-sm">
                      개인정보 수집 및 활용에 동의합니다. (개인정보는 수집만 하고 어디에 노출되지 않습니다) *
                    </Label>
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full">
                    다음 (1/3)
                  </Button>
                </div>
              )}

              {/* Page 2 - Document Upload */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">현직자 인증</h3>
                    <p className="text-gray-600 mb-4">
                      증빙 자료를 첨부해주세요. 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로 포함됩니다. 하지만,
                      증빙 자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히 인정되면 이벤트 보상 제공
                      대상에 포함될 수 있습니다.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        name="proofFile"
                        accept="image/*,application/pdf"
                        className="max-w-sm mx-auto"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        예: 사원증, 사내 시스템 화면 등 / 이미지 또는 PDF 파일, 15일 이내 자동 삭제됩니다
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" onClick={handlePrev} variant="outline" className="flex-1 bg-transparent">
                      이전
                    </Button>
                    <Button type="button" onClick={handleNext} className="flex-1">
                      다음 (2/3)
                    </Button>
                  </div>
                </div>
              )}

              {/* Page 3 - Detailed Review */}
              {currentPage === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">현직자 상세 리뷰</h3>

                  {reviewItems.map((item, index) => (
                    <div key={item.title} className="space-y-3 p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          {index + 1}. {item.title}
                        </h4>
                        {item.subtitle && <p className="text-sm text-gray-600">{item.subtitle}</p>}
                      </div>

                      {!item.isAdvice && (
                        <div>
                          <Label className="text-sm">{item.isDifficulty ? "난이도 평가 *" : "평점 평가 *"}</Label>
                          <select name={`${item.title}-rating`} required className="w-full p-2 border rounded-md">
                            <option value="">선택해주세요</option>
                            {item.isDifficulty ? (
                              <>
                                <option value="1">1 (쉬움)</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4 (어려움)</option>
                              </>
                            ) : (
                              <>
                                <option value="5">5 (매우 좋음)</option>
                                <option value="4">4 (좋음)</option>
                                <option value="3">3 (보통)</option>
                                <option value="2">2 (나쁨)</option>
                                <option value="1">1 (매우 나쁨)</option>
                              </>
                            )}
                          </select>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm">상세 리뷰 *</Label>
                        <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                        <textarea
                          name={`${item.title}-detail`}
                          placeholder="최소 50자 이상 입력해주세요"
                          rows={4}
                          required
                          className="w-full p-2 border rounded-md resize-none"
                          onChange={(e) => handleCharacterCount(item.title, e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">{characterCounts[item.title] || 0}/50자 이상</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4">
                    <Button type="button" onClick={handlePrev} variant="outline" className="flex-1 bg-transparent">
                      이전
                    </Button>
                    <Button type="submit" className="flex-1">
                      제출하기
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* Error Messages */}
            {errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
