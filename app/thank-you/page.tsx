import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">제출 완료!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              근무 후기를 성공적으로 제출해주셔서 감사합니다.
              <br />
              검토 후 이벤트 보상에 대해 안내드리겠습니다.
            </p>
            <Link href="/">
              <Button className="mt-6">홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
