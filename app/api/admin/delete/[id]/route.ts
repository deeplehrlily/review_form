import { type NextRequest, NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const kv = getKv()
    const reviewId = params.id

    // KV에서 해당 리뷰 삭제
    await kv.del(reviewId)

    return NextResponse.json({
      success: true,
      message: "후기가 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("후기 삭제 실패:", error)
    return NextResponse.json({ success: false, message: "후기 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}
