"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Upload, X, FileText, ImageIcon, File, Star, CheckCircle } from "lucide-react"

// 직무 데이터
const jobData = {
  개발: ["프론트엔드", "백엔드", "풀스택", "모바일", "DevOps", "QA"],
  디자인: ["UI/UX", "그래픽", "브랜드", "제품", "영상", "웹디자인"],
  마케팅: ["디지털마케팅", "콘텐츠", "브랜드", "퍼포먼스", "CRM", "PR"],
  영업: ["B2B영업", "B2C영업", "해외영업", "기술영업", "영업기획", "채널관리"],
  기획: ["서비스기획", "사업기획", "전략기획", "상품기획", "PM", "PO"],
  운영: ["서비스운영", "콘텐츠운영", "커뮤니티", "고객지원", "데이터분석", "CS"],
  인사: ["채용", "교육", "평가", "보상", "조직문화", "HRBP"],
  재무: ["회계", "세무", "자금", "투자", "예산", "FP&A"],
  기타: ["법무", "총무", "구매", "품질", "연구", "컨설팅"],
}

interface FormData {
  // 1단계: 개인정보
  name: string
  email: string
  phone: string
  education: string
  source: string

  // 2단계: 회사정보
  company: string
  postcode: string
  roadAddress: string
  detailAddress: string
  workType: string
  majorJob: string
  subJob: string
  startYear: string
  startMonth: string
  endYear: string
  endMonth: string

  // 3단계: 리뷰
  workEnvironmentRating: string
  workEnvironmentDifficulty: string
  workEnvironmentText: string

  salaryWelfareRating: string
  salaryWelfareDifficulty: string
  salaryWelfareText: string

  workLifeBalanceRating: string
  workLifeBalanceDifficulty: string
  workLifeBalanceText: string

  cultureRating: string
  cultureDifficulty: string
  cultureText: string

  growthRating: string
  growthDifficulty: string
  growthText: string

  recommendationRating: string
  recommendationDifficulty: string
  recommendationText: string

  advice: string

  // 동의
  agreePrivacy: boolean
}

interface UploadedFile {
  file: File
  preview?: string
}

export default function ReviewForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    education: "",
    source: "",
    company: "",
    postcode: "",
    roadAddress: "",
    detailAddress: "",
    workType: "",
    majorJob: "",
    subJob: "",
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    workEnvironmentRating: "",
    workEnvironmentDifficulty: "",
    workEnvironmentText: "",
    salaryWelfareRating: "",
    salaryWelfareDifficulty: "",
    salaryWelfareText: "",
    workLifeBalanceRating: "",
    workLifeBalanceDifficulty: "",
    workLifeBalanceText: "",
    cultureRating: "",
    cultureDifficulty: "",
    cultureText: "",
    growthRating: "",
    growthDifficulty: "",
    growthText: "",
    recommendationRating: "",
    recommendationDifficulty: "",
    recommendationText: "",
    advice: "",
    agreePrivacy: false,
  })

  // 다음 주소 API 스크립트 로드
  const loadDaumPostcode = () => {
    return new Promise((resolve) => {
      if (window.daum && window.daum.Postcode) {
        resolve(window.daum.Postcode)
        return
      }

      const script = document.createElement("script")
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      script.onload = () => resolve(window.daum.Postcode)
      document.head.appendChild(script)
    })
  }

  // 주소 검색
  const handleAddressSearch = async () => {
    const Postcode = await loadDaumPostcode()

    new Postcode({
      oncomplete: (data: any) => {
        setFormData((prev) => ({
          ...prev,
          postcode: data.zonecode,
          roadAddress: data.roadAddress,
        }))
      },
    }).open()
  }

  // 파일 업로드 처리 (미리보기만)
  const handleFileUpload = (files: FileList) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "image/heic", "image/heif"]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // 파일 크기 검증
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 10MB를 초과합니다.`)
        continue
      }

      // 파일 타입 검증
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`)
        continue
      }

      // 미리보기 생성
      const uploadFile: UploadedFile = { file }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          uploadFile.preview = e.target?.result as string
          setUploadedFiles((prev) => [...prev.filter((f) => f.file !== file), uploadFile])
        }
        reader.readAsDataURL(file)
      } else {
        setUploadedFiles((prev) => [...prev, uploadFile])
      }
    }
  }

  // 파일 삭제
  const handleFileRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  // 파일 아이콘 반환
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    } else if (file.type === "application/pdf") {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
    }
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 별점 컴포넌트
  const StarRating = ({
    rating,
    onRatingChange,
    name,
  }: { rating: string; onRatingChange: (rating: string) => void; name: string }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star.toString())}
            className={`p-1 transition-colors ${Number(rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
        {/* 숨겨진 input으로 Netlify Forms에 데이터 전송 */}
        <input type="hidden" name={name} value={rating} />
      </div>
    )
  }

  // 폼 제출 (Netlify Forms 방식)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreePrivacy) {
      alert("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      // FormData 객체 생성
      const submitFormData = new FormData()

      // 모든 폼 데이터 추가
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString())
      })

      // 파일들 추가
      uploadedFiles.forEach((uploadedFile, index) => {
        submitFormData.append(`proofFile${index + 1}`, uploadedFile.file)
      })

      // 제출 시간 추가
      submitFormData.append("submittedAt", new Date().toISOString())

      // Netlify Forms 식별자 추가
      submitFormData.append("form-name", "review-form")

      // Netlify Forms로 제출
      const response = await fetch("/", {
        method: "POST",
        body: submitFormData,
      })

      if (response.ok) {
        setIsSubmitted(true)
        // 폼 초기화
        setFormData({
          name: "",
          email: "",
          phone: "",
          education: "",
          source: "",
          company: "",
          postcode: "",
          roadAddress: "",
          detailAddress: "",
          workType: "",
          majorJob: "",
          subJob: "",
          startYear: "",
          startMonth: "",
          endYear: "",
          endMonth: "",
          workEnvironmentRating: "",
          workEnvironmentDifficulty: "",
          workEnvironmentText: "",
          salaryWelfareRating: "",
          salaryWelfareDifficulty: "",
          salaryWelfareText: "",
          workLifeBalanceRating: "",
          workLifeBalanceDifficulty: "",
          workLifeBalanceText: "",
          cultureRating: "",
          cultureDifficulty: "",
          cultureText: "",
          growthRating: "",
          growthDifficulty: "",
          growthText: "",
          recommendationRating: "",
          recommendationDifficulty: "",
          recommendationText: "",
          advice: "",
          agreePrivacy: false,
        })
        setUploadedFiles([])
        setCurrentStep(1)
      } else {
        throw new Error("제출 실패")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 다음 단계로
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // 이전 단계로
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8">
        <Card className="max-w-md mx-auto text-center shadow-xl">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">제출 완료!</h2>
            <p className="text-gray-600 mb-4">
              소중한 리뷰를 남겨주셔서 감사합니다.
              <br />
              검토 후 연락드리겠습니다.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setCurrentStep(1)
              }}
              className="w-full"
            >
              새 리뷰 작성하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">단계 {currentStep} / 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% 완료</span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">디맨드 근무 후기 이벤트</CardTitle>
            <p className="text-gray-600 mt-2">
              {currentStep === 1 && "개인정보를 입력해주세요"}
              {currentStep === 2 && "회사정보 및 증빙자료를 등록해주세요"}
              {currentStep === 3 && "근무 경험 리뷰를 작성해주세요"}
            </p>
          </CardHeader>

          <CardContent>
            {/* Netlify Forms를 위한 숨겨진 폼 */}
            <form
              ref={formRef}
              name="review-form"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Netlify Forms 식별을 위한 숨겨진 필드 */}
              <input type="hidden" name="form-name" value="review-form" />
              <input type="hidden" name="bot-field" />

              <div className="space-y-6">
                {/* 1단계: 개인정보 */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="실명을 입력해주세요"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="example@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="010-0000-0000"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="education">최종학력 *</Label>
                      <Select
                        name="education"
                        value={formData.education}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, education: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="최종학력을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="고등학교">고등학교</SelectItem>
                          <SelectItem value="전문대학">전문대학</SelectItem>
                          <SelectItem value="대학교">대학교</SelectItem>
                          <SelectItem value="대학원">대학원</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="source">어떤 경로로 후기 이벤트를 접하게 되었나요? *</Label>
                      <Select
                        name="source"
                        value={formData.source}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, source: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유입 경로를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="디맨드 홈페이지">디맨드 홈페이지</SelectItem>
                          <SelectItem value="디맨드 인스타그램">디맨드 인스타그램</SelectItem>
                          <SelectItem value="디맨드 스레드">디맨드 스레드</SelectItem>
                          <SelectItem value="디맨드 오픈채팅방">디맨드 오픈채팅방</SelectItem>
                          <SelectItem value="인스타그램 광고">인스타그램 광고</SelectItem>
                          <SelectItem value="디맨드 블로그">디맨드 블로그</SelectItem>
                          <SelectItem value="지인 추천">지인 추천</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* 2단계: 회사정보 및 증빙자료 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* 회사 정보 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">회사 정보</h3>

                      <div>
                        <Label htmlFor="company">회사명 (근무지명) *</Label>
                        <p className="text-xs text-gray-500 mb-2">
                          가능한 줄임 없이 풀어서 써주세요 (예: 하닉 → SK하이닉스)
                        </p>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                          placeholder="SK하이닉스"
                          required
                        />
                      </div>

                      <div>
                        <Label>사업장 주소 *</Label>
                        <div className="flex gap-2 mb-2">
                          <Input name="postcode" value={formData.postcode} placeholder="우편번호" readOnly required />
                          <Button type="button" onClick={handleAddressSearch} variant="outline">
                            주소 찾기
                          </Button>
                        </div>
                        <Input
                          name="roadAddress"
                          placeholder="도로명주소"
                          value={formData.roadAddress}
                          readOnly
                          className="mb-2"
                        />
                        <Input
                          name="detailAddress"
                          placeholder="상세주소를 입력해주세요"
                          value={formData.detailAddress}
                          onChange={(e) => setFormData((prev) => ({ ...prev, detailAddress: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="workType">근무형태 *</Label>
                        <Select
                          name="workType"
                          value={formData.workType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, workType: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="근무형태를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="현직장">현직장</SelectItem>
                            <SelectItem value="전직장">전직장</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="majorJob">직무 (대분류) *</Label>
                          <Select
                            name="majorJob"
                            value={formData.majorJob}
                            onValueChange={(value) => {
                              setFormData((prev) => ({ ...prev, majorJob: value, subJob: "" }))
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="대분류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(jobData).map((job) => (
                                <SelectItem key={job} value={job}>
                                  {job}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subJob">직무 (소분류) *</Label>
                          <Select
                            name="subJob"
                            value={formData.subJob}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, subJob: value }))}
                            disabled={!formData.majorJob}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="소분류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.majorJob &&
                                jobData[formData.majorJob as keyof typeof jobData]?.map((subJob) => (
                                  <SelectItem key={subJob} value={subJob}>
                                    {subJob}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>근무 기간 *</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-sm text-gray-600">시작일</Label>
                            <div className="flex gap-2">
                              <Select
                                name="startYear"
                                value={formData.startYear}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, startYear: value }))}
                                required
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
                                name="startMonth"
                                value={formData.startMonth}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, startMonth: value }))}
                                required
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
                            <Label className="text-sm text-gray-600">종료일</Label>
                            <div className="flex gap-2">
                              <Select
                                name="endYear"
                                value={formData.endYear}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, endYear: value }))}
                                required
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
                                name="endMonth"
                                value={formData.endMonth}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, endMonth: value }))}
                                required
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
                    </div>

                    {/* 증빙자료 업로드 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">증빙자료</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>증빙 자료를 첨부해주세요.</strong> 증빙이 인증되면 이벤트 보상 제공 대상에 자동으로
                          포함됩니다. 하지만, 증빙 자료가 첨부되지 않았더라도 근무했다는 사실이 리뷰를 통해 충분히
                          인정되면 이벤트 보상 제공 대상에 포함될 수 있습니다.
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 재직증명서</li>
                          <li>• 급여명세서</li>
                          <li>• 사원증 사진</li>
                          <li>• 기타 근무 증빙 자료</li>
                        </ul>
                      </div>

                      {/* 파일 업로드 영역 */}
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                        <p className="text-sm text-gray-500">JPG, PNG, PDF, HEIC 파일 (최대 10MB)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf,.heic,.heif"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>

                      {/* 업로드된 파일 목록 */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">업로드된 파일 ({uploadedFiles.length}개)</h4>
                          {uploadedFiles.map((uploadedFile, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {uploadedFile.preview ? (
                                  <img
                                    src={uploadedFile.preview || "/placeholder.svg"}
                                    alt="미리보기"
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  getFileIcon(uploadedFile.file)
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{uploadedFile.file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3단계: 리뷰 */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold">근무 후기 작성</h3>
                      <p className="text-gray-600 text-sm mt-2">솔직하고 구체적인 후기를 작성해주세요</p>
                    </div>

                    {/* 근무환경/시설 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">1. 근무환경/시설</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">별점 평가 *</Label>
                        <StarRating
                          rating={formData.workEnvironmentRating}
                          onRatingChange={(rating) =>
                            setFormData((prev) => ({ ...prev, workEnvironmentRating: rating }))
                          }
                          name="workEnvironmentRating"
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="workEnvironmentDifficulty"
                          value={formData.workEnvironmentDifficulty}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, workEnvironmentDifficulty: value }))
                          }
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="work-env-1" />
                            <Label htmlFor="work-env-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="work-env-2" />
                            <Label htmlFor="work-env-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="work-env-3" />
                            <Label htmlFor="work-env-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="work-env-4" />
                            <Label htmlFor="work-env-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="workEnvironmentText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.workEnvironmentText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, workEnvironmentText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.workEnvironmentText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 근무강도/스트레스 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">2. 근무강도/스트레스</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">별점 평가 *</Label>
                        <StarRating
                          rating={formData.salaryWelfareRating}
                          onRatingChange={(rating) => setFormData((prev) => ({ ...prev, salaryWelfareRating: rating }))}
                          name="salaryWelfareRating"
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="salaryWelfareDifficulty"
                          value={formData.salaryWelfareDifficulty}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, salaryWelfareDifficulty: value }))
                          }
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="salary-1" />
                            <Label htmlFor="salary-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="salary-2" />
                            <Label htmlFor="salary-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="salary-3" />
                            <Label htmlFor="salary-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="salary-4" />
                            <Label htmlFor="salary-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="salaryWelfareText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.salaryWelfareText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, salaryWelfareText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.salaryWelfareText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 급여/복지 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">3. 급여/복지</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">별점 평가 *</Label>
                        <StarRating
                          rating={formData.workLifeBalanceRating}
                          onRatingChange={(rating) =>
                            setFormData((prev) => ({ ...prev, workLifeBalanceRating: rating }))
                          }
                          name="workLifeBalanceRating"
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="workLifeBalanceDifficulty"
                          value={formData.workLifeBalanceDifficulty}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, workLifeBalanceDifficulty: value }))
                          }
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="balance-1" />
                            <Label htmlFor="balance-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="balance-2" />
                            <Label htmlFor="balance-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="balance-3" />
                            <Label htmlFor="balance-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="balance-4" />
                            <Label htmlFor="balance-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="workLifeBalanceText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.workLifeBalanceText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, workLifeBalanceText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.workLifeBalanceText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 안정성/전망 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">4. 안정성/전망</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">별점 평가 *</Label>
                        <StarRating
                          rating={formData.cultureRating}
                          onRatingChange={(rating) => setFormData((prev) => ({ ...prev, cultureRating: rating }))}
                          name="cultureRating"
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="cultureDifficulty"
                          value={formData.cultureDifficulty}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, cultureDifficulty: value }))}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="culture-1" />
                            <Label htmlFor="culture-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="culture-2" />
                            <Label htmlFor="culture-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="culture-3" />
                            <Label htmlFor="culture-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="culture-4" />
                            <Label htmlFor="culture-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="cultureText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.cultureText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cultureText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.cultureText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 사람들 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">5. 사람들</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">별점 평가 *</Label>
                        <StarRating
                          rating={formData.growthRating}
                          onRatingChange={(rating) => setFormData((prev) => ({ ...prev, growthRating: rating }))}
                          name="growthRating"
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="growthDifficulty"
                          value={formData.growthDifficulty}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, growthDifficulty: value }))}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="growth-1" />
                            <Label htmlFor="growth-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="growth-2" />
                            <Label htmlFor="growth-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="growth-3" />
                            <Label htmlFor="growth-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="growth-4" />
                            <Label htmlFor="growth-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="growthText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.growthText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, growthText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.growthText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 취업준비 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">6. 취업준비</Label>

                      <div className="mt-3">
                        <Label className="text-sm font-medium">난이도 평가 *</Label>
                        <RadioGroup
                          name="recommendationDifficulty"
                          value={formData.recommendationDifficulty}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, recommendationDifficulty: value }))
                          }
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="job-prep-1" />
                            <Label htmlFor="job-prep-1">1 (매우 쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="job-prep-2" />
                            <Label htmlFor="job-prep-2">2 (쉬움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="job-prep-3" />
                            <Label htmlFor="job-prep-3">3 (어려움)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="job-prep-4" />
                            <Label htmlFor="job-prep-4">4 (매우 어려움)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium">상세 리뷰 *</Label>
                        <Textarea
                          name="recommendationText"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 경험을 바탕으로 작성해주세요."
                          value={formData.recommendationText}
                          onChange={(e) => setFormData((prev) => ({ ...prev, recommendationText: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.recommendationText.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 조언 */}
                    <div className="border rounded-lg p-4">
                      <Label className="text-lg font-semibold">7. 이 곳에서 일하게 될 사람들에게 한마디</Label>

                      <div className="mt-4">
                        <Textarea
                          name="advice"
                          rows={5}
                          placeholder="최소 50자 이상 구체적인 조언을 작성해주세요."
                          value={formData.advice}
                          onChange={(e) => setFormData((prev) => ({ ...prev, advice: e.target.value }))}
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          현재 글자 수: {formData.advice.length}자 (최소 50자)
                        </div>
                      </div>
                    </div>

                    {/* 개인정보 동의 */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, agreePrivacy: checked as boolean }))
                        }
                        required
                      />
                      <div>
                        <Label htmlFor="privacy" className="text-sm font-medium">
                          개인정보 수집 및 이용에 동의합니다. *
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">개인정보는 수집만 하고 외부에 노출되지 않습니다.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </Button>

                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                      다음 단계로 ({currentStep}/3)
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!formData.agreePrivacy || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          제출 중...
                        </>
                      ) : (
                        "후기 제출하기"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 다음 주소 API 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string
          roadAddress: string
        }) => void
      }) => {
        open: () => void
      }
    }
  }
}
