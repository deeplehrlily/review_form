"use client"

import { useState, useEffect, useMemo, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jobData } from "@/lib/job-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

// Daum Postcode API 타입 정의
declare global {
  interface Window {
    daum: any
  }
}

const initialFormData = {
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
  majorJob: "",
  subJob: "",
  agreePrivacy: false,
  startDate: { year: "", month: "" },
  endDate: { year: "", month: "" },
  proof: null,
  reviews: {},
}

const reviewItems = [
  { id: "work_env", title: "근무환경/시설", type: "rating" },
  { id: "work_intensity", title: "근무강도/스트레스", type: "rating" },
  { id: "salary_welfare", title: "급여/복지", type: "rating" },
  { id: "stability_prospects", title: "안정성/전망", type: "rating" },
  { id: "people", title: "사람들", type: "rating" },
  { id: "job_prep", title: "취업준비", type: "difficulty" },
  { id: "interview_prep", title: "면접준비", type: "difficulty" },
  { id: "advice", title: "이 곳에서 일하게 될 사람들에게 한마디", type: "textarea" },
]

export default function ReviewFormPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [isShaking, setIsShaking] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const subJobs = useMemo(() => {
    if (formData.majorJob) {
      return jobData.subCategories[formData.majorJob] || []
    }
    return []
  }, [formData.majorJob])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleDateChange = (type: "startDate" | "endDate", field: "year" | "month", value: string) => {
    const newFormData = {
      ...formData,
      [type]: { ...formData[type], [field]: value },
    }

    const { startDate, endDate } = newFormData
    if (startDate.year && startDate.month && endDate.year && endDate.month) {
      const start = new Date(Number.parseInt(startDate.year), Number.parseInt(startDate.month) - 1)
      const end = new Date(Number.parseInt(endDate.year), Number.parseInt(endDate.month) - 1)
      if (end < start) {
        alert("종료일이 시작일보다 빠를 수 없습니다.")
        return // 변경을 취소하거나, endDate를 리셋할 수 있습니다.
      }
    }
    setFormData(newFormData)
  }

  const handleOpenPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          setFormData((prev) => ({
            ...prev,
            postcode: data.zonecode,
            roadAddress: data.roadAddress,
          }))
          document.getElementById("detailAddress")?.focus()
        },
      }).open()
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {}
    const requiredFields: (keyof typeof initialFormData)[] = [
      "name",
      "email",
      "phone",
      "source",
      "education",
      "company",
      "postcode",
      "detailAddress",
      "majorJob",
      "subJob",
    ]
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = true
      }
    })
    if (!formData.startDate.year || !formData.startDate.month || !formData.endDate.year || !formData.endDate.month) {
      newErrors.workPeriod = true
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = true
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) {
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 400)
        return
      }
    }
    setStep((prev) => Math.min(prev + 1, 3))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: Add validation for step 3
    console.log("Form Data Submitted:", formData)
    alert("제출 완료! 참여해주셔서 감사합니다.")
  }

  const renderYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 70; i--) {
      years.push(
        <SelectItem key={i} value={String(i)}>
          {i}년
        </SelectItem>,
      )
    }
    return years
  }

  const renderMonths = () => {
    const months = []
    for (let i = 1; i <= 12; i++) {
      months.push(
        <SelectItem key={i} value={String(i)}>
          {i}월
        </SelectItem>,
      )
    }
    return months
  }

  return (
    <div className="bg-gray-50 font-sans min-h-screen p-4 sm:p-8">
      <Card className={`max-w-3xl mx-auto transition-transform duration-300 ${isShaking ? "animate-shake" : ""}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {step === 1 && "근무 후기 이벤트 참여"}
            {step === 2 && "현직자 인증"}
            {step === 3 && "현직자 상세 리뷰"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xl mx-auto mb-6">
            <Progress value={(step / 3) * 100} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-2">{step} / 3</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className={errors.phone ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>어떤 경로로 후기 이벤트를 접하게 되었나요?</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                    value={formData.source}
                    required
                  >
                    <SelectTrigger className={errors.source ? "border-red-500" : ""}>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">디맨드 홈페이지</SelectItem>
                      <SelectItem value="instagram">디맨드 인스타그램</SelectItem>
                      <SelectItem value="threads">디맨드 스레드</SelectItem>
                      <SelectItem value="chat">디맨드 오픈채팅방</SelectItem>
                      <SelectItem value="ig_ad">인스타그램 광고</SelectItem>
                      <SelectItem value="blog">디맨드 블로그</SelectItem>
                      <SelectItem value="etc">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>최종학력</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                    value={formData.education}
                    required
                  >
                    <SelectTrigger className={errors.education ? "border-red-500" : ""}>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">고졸</SelectItem>
                      <SelectItem value="college">초대졸</SelectItem>
                      <SelectItem value="university">대졸</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company">회사명 (근무지명)</Label>
                  <p className="text-xs text-gray-500 mb-2">가능한 줄임 없이 풀어서 써주세요 (예: 하닉 → SK하이닉스)</p>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className={errors.company ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>사업장 주소</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="postcode"
                      placeholder="우편번호"
                      value={formData.postcode}
                      readOnly
                      required
                      className={errors.postcode ? "border-red-500" : ""}
                    />
                    <Button type="button" onClick={handleOpenPostcode}>
                      주소 찾기
                    </Button>
                  </div>
                  <Input placeholder="도로명 주소" value={formData.roadAddress} readOnly required className="mb-2" />
                  <Input
                    id="detailAddress"
                    placeholder="상세주소 입력"
                    value={formData.detailAddress}
                    onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                    required
                    className={errors.detailAddress ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>근무 기간</Label>
                  <div
                    className={`grid grid-cols-2 gap-2 items-center p-2 rounded-md ${errors.workPeriod ? "border border-red-500" : ""}`}
                  >
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(v) => handleDateChange("startDate", "year", v)}
                        value={formData.startDate.year}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="시작 연도" />
                        </SelectTrigger>
                        <SelectContent>{renderYears()}</SelectContent>
                      </Select>
                      <Select
                        onValueChange={(v) => handleDateChange("startDate", "month", v)}
                        value={formData.startDate.month}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="월" />
                        </SelectTrigger>
                        <SelectContent>{renderMonths()}</SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(v) => handleDateChange("endDate", "year", v)}
                        value={formData.endDate.year}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="종료 연도" />
                        </SelectTrigger>
                        <SelectContent>{renderYears()}</SelectContent>
                      </Select>
                      <Select
                        onValueChange={(v) => handleDateChange("endDate", "month", v)}
                        value={formData.endDate.month}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="월" />
                        </SelectTrigger>
                        <SelectContent>{renderMonths()}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>근무 형태</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, workType: value })}
                    value={formData.workType}
                    required
                  >
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
                  <Label>직무 (대분류)</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, majorJob: value, subJob: "" })}
                    value={formData.majorJob}
                    required
                  >
                    <SelectTrigger className={errors.majorJob ? "border-red-500" : ""}>
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(jobData.majorCategories).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {subJobs.length > 0 && (
                  <div>
                    <Label>직무 (소분류)</Label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, subJob: value })}
                      value={formData.subJob}
                      required
                    >
                      <SelectTrigger className={errors.subJob ? "border-red-500" : ""}>
                        <SelectValue placeholder="소분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {subJobs.map(({ code, name }) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: !!checked })}
                    className={`mt-1 ${errors.agreePrivacy ? "border-red-500" : ""}`}
                  />
                  <div>
                    <label
                      htmlFor="agreePrivacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      개인정보 수집 및 활용에 동의합니다.
                    </label>
                    <p className="text-xs text-gray-500 mt-1">개인정보는 수집만 하고 외부에 노출되지 않습니다.</p>
                  </div>
                </div>
                <Button type="button" onClick={handleNext} className="w-full">
                  다음 (1/3)
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>증빙 자료 안내</AlertTitle>
                  <AlertDescription>
                    증빙 자료를 첨부해주세요. 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로 포함됩니다. 하지만, 증빙
                    자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히 인정되면 이벤트 보상 제공 대상에
                    포함될 수 있습니다. (예: 사원증, 사내 시스템 화면 등 / 이미지 또는 PDF 파일)
                  </AlertDescription>
                </Alert>
                <div className="p-8 border-2 border-dashed rounded-lg text-center">
                  <Label htmlFor="proof" className="cursor-pointer">
                    <div className="text-gray-500">파일을 선택하거나 여기에 드래그하세요.</div>
                    <Input
                      id="proof"
                      type="file"
                      accept="image/*,application/pdf"
                      className="mt-4"
                      onChange={(e) => setFormData({ ...formData, proof: e.target.files ? e.target.files[0] : null })}
                    />
                  </Label>
                </div>
                <div className="flex gap-4">
                  <Button type="button" onClick={handlePrev} variant="outline" className="w-full bg-transparent">
                    이전
                  </Button>
                  <Button type="button" onClick={handleNext} className="w-full">
                    다음 (2/3)
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                {reviewItems.map((item, index) => (
                  <div key={item.id}>
                    <Label className="text-lg font-semibold">
                      {index + 1}. {item.title}
                    </Label>
                    {item.type === "rating" && (
                      <div className="mt-2">
                        <Select
                          required
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              reviews: { ...prev.reviews, [item.id]: { ...prev.reviews[item.id], rating: value } },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="별점 선택 (1~5점)" />
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
                      <div className="mt-2">
                        <Label className="text-sm font-medium">난이도 평가</Label>
                        <Select
                          required
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              reviews: { ...prev.reviews, [item.id]: { ...prev.reviews[item.id], difficulty: value } },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="난이도 선택" />
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
                    <div className="mt-4">
                      <Label className="text-sm font-medium">상세 리뷰 *</Label>
                      <Textarea
                        required
                        minLength={50}
                        rows={5}
                        placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                        className="mt-1"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            reviews: { ...prev.reviews, [item.id]: { ...prev.reviews[item.id], text: e.target.value } },
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <Button type="button" onClick={handlePrev} variant="outline" className="w-full bg-transparent">
                    이전
                  </Button>
                  <Button type="submit" className="w-full">
                    제출하기
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
