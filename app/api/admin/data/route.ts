import { NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function GET() {
  try {
    const kv = getKv()

    // KV에서 모든 리뷰 키 가져오기
    const keys = await kv.keys("review:*")

    // 각 키에 대한 데이터 가져오기
    const reviews = []
    for (const key of keys) {
      const data = await kv.get(key)
      if (data) {
        reviews.push({
          id: key,
          ...data,
        })
      }
    }

    // 제출일시 기준으로 최신순 정렬
    reviews.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length,
    })
  } catch (error) {
    console.error("관리자 데이터 조회 실패:", error)
    return NextResponse.json({ success: false, message: "데이터 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
