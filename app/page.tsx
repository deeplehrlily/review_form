"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function NetlifyFormsTest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      console.log("=== 폼 제출 시작 ===")

      // FormData 생성
      const submitData = new FormData()
      submitData.append("form-name", "contact")
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)
      submitData.append("message", formData.message)
      submitData.append("submitted-at", new Date().toLocaleString("ko-KR"))

      console.log("제출 데이터:")
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`)
      }

      // Netlify Forms로 제출
      const response = await fetch("/", {
        method: "POST",
        body: submitData,
      })

      console.log("응답 상태:", response.status)
      console.log("응답 헤더:", [...response.headers.entries()])

      if (response.ok) {
        setResult({ type: "success", message: "✅ 성공! Netlify 대시보드에서 확인하세요." })
        setIsSubmitted(true)
        // 폼 초기화
        setFormData({ name: "", email: "", message: "" })
      } else {
        const responseText = await response.text()
        console.error("응답 내용:", responseText)
        setResult({ type: "error", message: `❌ 실패: ${response.status} ${response.statusText}` })
      }
    } catch (error) {
      console.error("에러:", error)
      setResult({ type: "error", message: `❌ 에러: ${error.message}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const quickTest = async () => {
    setIsSubmitting(true)
    setResult(null)

    try {
      console.log("=== 빠른 테스트 시작 ===")

      const testData = new FormData()
      testData.append("form-name", "contact")
      testData.append("name", "테스트 사용자")
      testData.append("email", "test@example.com")
      testData.append("message", "이것은 테스트 메시지입니다.")
      testData.append("submitted-at", new Date().toLocaleString("ko-KR"))

      console.log("테스트 데이터:")
      for (const [key, value] of testData.entries()) {
        console.log(`${key}: ${value}`)
      }

      const response = await fetch("/", {
        method: "POST",
        body: testData,
      })

      console.log("응답 상태:", response.status)

      if (response.ok) {
        setResult({ type: "success", message: "✅ 빠른 테스트 성공! Netlify 대시보드를 확인하세요." })
      } else {
        const responseText = await response.text()
        console.error("응답 내용:", responseText)
        setResult({ type: "error", message: `❌ 빠른 테스트 실패: ${response.status}` })
      }
    } catch (error) {
      console.error("에러:", error)
      setResult({ type: "error", message: `❌ 에러: ${error.message}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-semibold mb-4">제출 완료!</h1>
              <p className="text-gray-600 mb-6">
                폼이 성공적으로 제출되었습니다.
                <br />
                Netlify 대시보드에서 확인해보세요.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                다시 테스트하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Netlify Forms를 위한 숨겨진 폼 */}
      <form name="contact" netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
        <input type="text" name="submitted-at" />
      </form>

      <div className="max-w-md mx-auto space-y-6">
        {/* 빠른 테스트 섹션 */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 text-yellow-800">🚀 빠른 테스트</h2>
            <p className="text-sm text-yellow-700 mb-4">
              미리 입력된 데이터로 바로 테스트해보세요.
              <br />
              F12를 눌러 콘솔을 확인하세요.
            </p>
            <Button onClick={quickTest} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? "테스트 중..." : "빠른 테스트 실행"}
            </Button>
          </CardContent>
        </Card>

        {/* 메인 폼 */}
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold mb-6">Netlify Forms 테스트</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="홍길동"
                />
              </div>

              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="test@example.com"
                />
              </div>

              <div>
                <Label htmlFor="message">메시지 *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  placeholder="테스트 메시지를 입력하세요..."
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "제출 중..." : "폼 제출하기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 결과 표시 */}
        {result && (
          <Alert className={result.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.type === "success" ? "text-green-800" : "text-red-800"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        {/* 디버그 정보 */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">🔍 디버그 정보</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                현재 URL:{" "}
                <span className="font-mono">{typeof window !== "undefined" ? window.location.href : "Loading..."}</span>
              </p>
              <p>
                폼 상태: <span className="font-mono">{isSubmitting ? "제출 중" : "대기 중"}</span>
              </p>
              <p>
                마지막 결과: <span className="font-mono">{result ? result.message : "없음"}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 사용법 안내 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2 text-blue-800">📋 사용법</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. "빠른 테스트 실행" 버튼으로 즉시 테스트</p>
              <p>2. 또는 직접 폼을 작성해서 제출</p>
              <p>3. F12 → Console 탭에서 상세 로그 확인</p>
              <p>4. Netlify 대시보드 → Forms에서 데이터 확인</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
