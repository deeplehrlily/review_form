"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Star, Upload, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ReviewForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    // Netlify Forms가 자동으로 처리하므로 별도 로직 불필요
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">제출 완료!</h2>
            <p className="text-gray-600">소중한 후기를 남겨주셔서 감사합니다. 검토 후 연락드리겠습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML 템플릿 후기</h1>
          <p className="text-gray-600">구매하신 템플릿에 대한 솔직한 후기를 남겨주세요</p>
        </div>

        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>
              {currentStep}/{totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Netlify Forms */}
        <form
          name="template-review"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Netlify Forms 필수 필드 */}
          <input type="hidden" name="form-name" value="template-review" />
          <p style={{ display: "none" }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Step {currentStep}</Badge>
                {currentStep === 1 && "개인 정보"}
                {currentStep === 2 && "구매 정보"}
                {currentStep === 3 && "후기 작성"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "기본 정보를 입력해주세요"}
                {currentStep === 2 && "구매하신 템플릿 정보를 알려주세요"}
                {currentStep === 3 && "템플릿 사용 후기를 작성해주세요"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: 개인정보 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input id="name" name="name" required placeholder="홍길동" />
                    </div>
                    <div>
                      <Label htmlFor="email">이메일 *</Label>
                      <Input id="email" name="email" type="email" required placeholder="example@email.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">연락처</Label>
                    <Input id="phone" name="phone" placeholder="010-1234-5678" />
                  </div>
                  <div>
                    <Label htmlFor="company">회사명</Label>
                    <Input id="company" name="company" placeholder="회사명을 입력해주세요" />
                  </div>
                </div>
              )}

              {/* Step 2: 구매정보 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">구매한 템플릿명 *</Label>
                    <Input
                      id="template-name"
                      name="template-name"
                      required
                      placeholder="예: 비즈니스 랜딩페이지 템플릿"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchase-date">구매일</Label>
                    <Input id="purchase-date" name="purchase-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="usage-purpose">사용 목적</Label>
                    <Select name="usage-purpose">
                      <SelectTrigger>
                        <SelectValue placeholder="사용 목적을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">비즈니스 웹사이트</SelectItem>
                        <SelectItem value="portfolio">포트폴리오</SelectItem>
                        <SelectItem value="blog">블로그</SelectItem>
                        <SelectItem value="ecommerce">쇼핑몰</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="website-url">완성된 웹사이트 URL</Label>
                    <Input id="website-url" name="website-url" type="url" placeholder="https://example.com" />
                  </div>
                </div>
              )}

              {/* Step 3: 후기 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* 별점 */}
                  <div>
                    <Label className="text-base font-medium">전체 만족도 *</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="rating" value={rating} />
                  </div>

                  {/* 상세 평가 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="design-rating">디자인 품질</Label>
                      <Select name="design-rating">
                        <SelectTrigger>
                          <SelectValue placeholder="평가" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">매우 만족</SelectItem>
                          <SelectItem value="4">만족</SelectItem>
                          <SelectItem value="3">보통</SelectItem>
                          <SelectItem value="2">불만족</SelectItem>
                          <SelectItem value="1">매우 불만족</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="code-quality">코드 품질</Label>
                      <Select name="code-quality">
                        <SelectTrigger>
                          <SelectValue placeholder="평가" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">매우 만족</SelectItem>
                          <SelectItem value="4">만족</SelectItem>
                          <SelectItem value="3">보통</SelectItem>
                          <SelectItem value="2">불만족</SelectItem>
                          <SelectItem value="1">매우 불만족</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 후기 텍스트 */}
                  <div>
                    <Label htmlFor="review-text">상세 후기 *</Label>
                    <Textarea
                      id="review-text"
                      name="review-text"
                      required
                      rows={5}
                      placeholder="템플릿을 사용해보신 솔직한 후기를 작성해주세요. 좋았던 점, 아쉬웠던 점, 개선사항 등을 자유롭게 작성해주세요."
                    />
                  </div>

                  {/* 파일 업로드 */}
                  <div>
                    <Label htmlFor="screenshots">스크린샷 또는 증빙자료</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        id="screenshots"
                        name="screenshots"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                      <label htmlFor="screenshots" className="cursor-pointer">
                        <span className="text-sm text-gray-600">클릭하여 파일을 선택하거나 드래그하여 업로드</span>
                        <br />
                        <span className="text-xs text-gray-400">PNG, JPG, PDF (최대 10MB)</span>
                      </label>
                    </div>
                  </div>

                  {/* 추천 여부 */}
                  <div>
                    <Label htmlFor="recommend">다른 사람에게 추천하시겠습니까?</Label>
                    <Select name="recommend">
                      <SelectTrigger>
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">네, 추천합니다</SelectItem>
                        <SelectItem value="maybe">상황에 따라 추천</SelectItem>
                        <SelectItem value="no">추천하지 않습니다</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </Button>

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                    다음
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4" />
                    후기 제출
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
