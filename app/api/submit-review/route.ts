import { type NextRequest, NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function POST(request: NextRequest) {
  try {
    const kv = getKv()
    const formData = await request.json()

    console.log("📝 API 라우트에서 받은 데이터:", formData)

    // 고유 ID 생성
    const reviewId = crypto.randomUUID()

    // 제출 시간 추가
    const reviewData = {
      ...formData,
      id: reviewId,
      submittedAt: new Date().toISOString(),
    }

    // KV에 저장
    await kv.set(`review:${reviewId}`, reviewData)

    console.log("✅ 데이터 저장 완료:", reviewId)

    return NextResponse.json({
      success: true,
      message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다.",
    })
  } catch (error) {
    console.error("❌ API 라우트 오류:", error)
    return NextResponse.json(
      {
        success: false,
        message: "제출 중 오류가 발생했습니다. 다시 시도해주세요.",
      },
      { status: 500 },
    )
  }
}
