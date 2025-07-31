"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jobData } from "@/lib/job-data"
import { uploadFile } from "@/lib/supabase"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"

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
  reviews: {} as Record<string, any>,
  proofFiles: [] as File[],
  proofUrls: [] as string[],
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
        return
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newFiles: File[] = []
    const newUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 파일 크기 체크 (10MB 제한)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name}은(는) 10MB를 초과합니다.`)
          continue
        }

        // 파일 타입 체크
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "image/heic", "image/heif"]
        if (!allowedTypes.includes(file.type)) {
          alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다. (JPG, PNG, PDF만 가능)`)
          continue
        }

        // 파일명 생성 (타임스탬프 + 원본명)
        const timestamp = Date.now()
        const fileName = `${timestamp}_${file.name}`

        // Supabase Storage에 업로드
        const publicUrl = await uploadFile(file, fileName)

        newFiles.push(file)
        newUrls.push(publicUrl)
      }

      setFormData((prev) => ({
        ...prev,
        proofFiles: [...prev.proofFiles, ...newFiles],
        proofUrls: [...prev.proofUrls, ...newUrls],
      }))

      // 파일 input 초기화
      event.target.value = ""
    } catch (error) {
      console.error("파일 업로드 오류:", error)
      alert("파일 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      proofFiles: prev.proofFiles.filter((_, i) => i !== index),
      proofUrls: prev.proofUrls.filter((_, i) => i !== index),
    }))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    } else if (file.type === "application/pdf") {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
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

  const validateStep3 = () => {
    const newErrors: Record<string, boolean> = {}

    reviewItems.forEach((item) => {
      const reviewData = formData.reviews[item.id]

      if (item.type === "rating" && !reviewData?.rating) {
        newErrors[`${item.id}_rating`] = true
      }

      if (item.type === "difficulty" && !reviewData?.difficulty) {
        newErrors[`${item.id}_difficulty`] = true
      }

      if (!reviewData?.text || reviewData.text.length < 50) {
        newErrors[`${item.id}_text`] = true
      }
    })

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

  const updateReviewData = (itemId: string, field: string, value: string) => {
    setFormData((prev) => {
      const newReviews = {
        ...prev.reviews,
        [itemId]: {
          ...prev.reviews[itemId],
          [field]: value,
        },
      }
      return {
        ...prev,
        reviews: newReviews,
      }
    })
  }

  const handleSubmit = async () => {
    if (!validateStep3()) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 400)
      alert("모든 필수 항목을 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      // 완전한 데이터 구조로 전송
      const completeFormData = {
        // 개인 정보
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        source: formData.source,

        // 회사 정보
        company: formData.company,
        postcode: formData.postcode,
        roadAddress: formData.roadAddress,
        detailAddress: formData.detailAddress,
        workType: formData.workType,
        majorJob: formData.majorJob,
        subJob: formData.subJob,

        // 근무 기간
        startDate: formData.startDate,
        endDate: formData.endDate,

        // 리뷰 내용
        reviews: formData.reviews,

        // 증빙 자료 URL들
        proofUrls: formData.proofUrls,

        // 메타 정보
        submittedAt: new Date().toISOString(),
        agreePrivacy: formData.agreePrivacy,
      }

      console.log("제출할 데이터:", JSON.stringify(completeFormData, null, 2))

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeFormData),
      })

      const result = await response.json()

      if (result.success) {
        alert("성공적으로 제출되었습니다!")
        setFormData(initialFormData)
        setStep(1)
      } else {
        alert("제출 실패: " + result.message)
      }
    } catch (error) {
      console.error("제출 오류:", error)
      alert("제출 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
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
          <CardTitle className="text-2xl sm:text-3xl font-bold">디맨드 근무 후기 이벤트</CardTitle>
          <p className="text-gray-600 mt-2">근무 후기를 남기고 특별한 혜택을 받아보세요</p>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xl mx-auto mb-6">
            <Progress value={(step / 3) * 100} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-2">{step} / 3</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="홍길동"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">이름을 입력해주세요</p>}
              </div>

              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">이메일을 입력해주세요</p>}
              </div>

              <div>
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="010-1234-5678"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">전화번호를 입력해주세요</p>}
              </div>

              <div>
                <Label>어떤 경로로 후기 이벤트를 접하게 되었나요? *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, source: value })} value={formData.source}>
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
                {errors.source && <p className="text-red-500 text-xs mt-1">경로를 선택해주세요</p>}
              </div>

              <div>
                <Label>최종학력 *</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
                  value={formData.education}
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
                {errors.education && <p className="text-red-500 text-xs mt-1">학력을 선택해주세요</p>}
              </div>

              <div>
                <Label htmlFor="company">회사명 (근무지명) *</Label>
                <p className="text-xs text-gray-500 mb-2">가능한 줄임 없이 풀어서 써주세요 (예: 하닉 → SK하이닉스)</p>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={errors.company ? "border-red-500" : ""}
                  placeholder="SK하이닉스"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">회사명을 입력해주세요</p>}
              </div>

              <div>
                <Label>사업장 주소 *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="postcode"
                    placeholder="우편번호"
                    value={formData.postcode}
                    readOnly
                    className={errors.postcode ? "border-red-500" : ""}
                  />
                  <Button type="button" onClick={handleOpenPostcode} variant="outline">
                    주소 찾기
                  </Button>
                </div>
                <Input placeholder="도로명 주소" value={formData.roadAddress} readOnly className="mb-2" />
                <Input
                  id="detailAddress"
                  placeholder="상세주소 입력"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                  className={errors.detailAddress ? "border-red-500" : ""}
                />
                {(errors.postcode || errors.detailAddress) && (
                  <p className="text-red-500 text-xs mt-1">주소를 입력해주세요</p>
                )}
              </div>

              <div>
                <Label>근무 기간 *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm text-gray-600">시작일</Label>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(v) => handleDateChange("startDate", "year", v)}
                        value={formData.startDate.year}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="연도" />
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
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">종료일</Label>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(v) => handleDateChange("endDate", "year", v)}
                        value={formData.endDate.year}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="연도" />
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
                {errors.workPeriod && <p className="text-red-500 text-xs mt-1">근무 기간을 입력해주세요</p>}
              </div>

              <div>
                <Label>근무 형태 *</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, workType: value })}
                  value={formData.workType}
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
                <Label>직무 (대분류) *</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, majorJob: value, subJob: "" })}
                  value={formData.majorJob}
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
                {errors.majorJob && <p className="text-red-500 text-xs mt-1">직무 대분류를 선택해주세요</p>}
              </div>

              {subJobs.length > 0 && (
                <div>
                  <Label>직무 (소분류) *</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, subJob: value })}
                    value={formData.subJob}
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
                  {errors.subJob && <p className="text-red-500 text-xs mt-1">직무 소분류를 선택해주세요</p>}
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
                    개인정보 수집 및 활용에 동의합니다. *
                  </label>
                  <p className="text-xs text-gray-500 mt-1">개인정보는 수집만 하고 외부에 노출되지 않습니다.</p>
                  {errors.agreePrivacy && <p className="text-red-500 text-xs mt-1">개인정보 동의가 필요합니다</p>}
                </div>
              </div>

              <Button type="button" onClick={handleNext} className="w-full">
                다음 단계로 (1/3)
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">증빙 자료 첨부</h3>
                <p className="text-sm text-blue-700 mb-4">
                  증빙 자료를 첨부해주세요. 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로 포함됩니다. 하지만, 증빙
                  자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히 인정되면 이벤트 보상 제공 대상에
                  포함될 수 있습니다.
                </p>
                <div className="text-left text-sm text-gray-600 space-y-1">
                  <p>• 재직증명서</p>
                  <p>• 급여명세서</p>
                  <p>• 사원증 사진</p>
                  <p>• 기타 근무 증빙 자료</p>
                </div>
              </div>

              {/* 파일 업로드 영역 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        파일을 드래그하거나 클릭하여 업로드
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">JPG, PNG, PDF 파일만 가능 (최대 10MB)</span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.heic,.heif"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">파일 업로드 중...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 업로드된 파일 목록 */}
              {formData.proofFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">업로드된 파일 ({formData.proofFiles.length}개)</Label>
                  {formData.proofFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" onClick={handlePrev} variant="outline" className="w-full bg-transparent">
                  이전
                </Button>
                <Button type="button" onClick={handleNext} className="w-full">
                  다음 단계로 (2/3)
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">근무 후기 작성</h3>
                <p className="text-gray-600 text-sm mt-2">솔직하고 구체적인 후기를 작성해주세요</p>
              </div>

              {reviewItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <Label className="text-lg font-semibold">
                    {index + 1}. {item.title}
                  </Label>

                  {item.type === "rating" && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">별점 평가 *</Label>
                      <Select
                        onValueChange={(value) => updateReviewData(item.id, "rating", value)}
                        value={formData.reviews[item.id]?.rating || ""}
                      >
                        <SelectTrigger className={errors[`${item.id}_rating`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="별점 선택 (1~5점)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">★★★★★ (5점) - 매우 좋음</SelectItem>
                          <SelectItem value="4">★★★★☆ (4점) - 좋음</SelectItem>
                          <SelectItem value="3">★★★☆☆ (3점) - 보통</SelectItem>
                          <SelectItem value="2">★★☆☆☆ (2점) - 나쁨</SelectItem>
                          <SelectItem value="1">★☆☆☆☆ (1점) - 매우 나쁨</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`${item.id}_rating`] && <p className="text-red-500 text-xs mt-1">별점을 선택해주세요</p>}
                    </div>
                  )}

                  {item.type === "difficulty" && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">난이도 평가 *</Label>
                      <Select
                        onValueChange={(value) => updateReviewData(item.id, "difficulty", value)}
                        value={formData.reviews[item.id]?.difficulty || ""}
                      >
                        <SelectTrigger className={errors[`${item.id}_difficulty`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="난이도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (매우 쉬움)</SelectItem>
                          <SelectItem value="2">2 (쉬움)</SelectItem>
                          <SelectItem value="3">3 (어려움)</SelectItem>
                          <SelectItem value="4">4 (매우 어려움)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`${item.id}_difficulty`] && (
                        <p className="text-red-500 text-xs mt-1">난이도를 선택해주세요</p>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <Label className="text-sm font-medium">상세 리뷰 *</Label>
                    <Textarea
                      rows={5}
                      placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                      className={`mt-1 ${errors[`${item.id}_text`] ? "border-red-500" : ""}`}
                      value={formData.reviews[item.id]?.text || ""}
                      onChange={(e) => updateReviewData(item.id, "text", e.target.value)}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span
                        className={`${(formData.reviews[item.id]?.text?.length || 0) < 50 ? "text-red-500" : "text-gray-500"}`}
                      >
                        현재 글자 수: {formData.reviews[item.id]?.text?.length || 0}자 (최소 50자)
                      </span>
                    </div>
                    {errors[`${item.id}_text`] && (
                      <p className="text-red-500 text-xs mt-1">최소 50자 이상 작성해주세요</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <Button type="button" onClick={handlePrev} variant="outline" className="w-full bg-transparent">
                  이전
                </Button>
                <Button type="button" onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "제출 중..." : "후기 제출하기"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
