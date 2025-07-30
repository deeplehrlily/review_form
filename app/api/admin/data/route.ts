import { NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function GET() {
  try {
    const kv = getKv()

    // 모든 리뷰 키 가져오기
    const keys = await kv.keys("review:*")

    // 각 키에 대한 데이터 가져오기
    const data = await Promise.all(
      keys.map(async (key) => {
        const value = await kv.get(key)
        return value
      }),
    )

    // 제출일시 기준 내림차순 정렬
    const sortedData = data
      .filter((item) => item) // null 값 제거
      .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      success: true,
      data: sortedData,
      count: sortedData.length,
    })
  } catch (error) {
    console.error("데이터 조회 실패:", error)
    return NextResponse.json({ success: false, message: "데이터 조회 실패" }, { status: 500 })
  }
}
