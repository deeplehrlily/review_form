import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: 모든 리뷰 조회
export async function GET(request: NextRequest) {
  try {
    console.log("📊 리뷰 데이터 조회 시작")

    const { data, error } = await supabase.from("reviews").select("*").order("submitted_at", { ascending: false })

    if (error) {
      console.error("❌ 데이터 조회 실패:", error)
      return NextResponse.json({ success: false, message: "데이터 조회 실패", error: error.message }, { status: 500 })
    }

    console.log(`✅ 총 ${data.length}개의 리뷰 조회 성공`)

    return NextResponse.json({
      success: true,
      reviews: data,
      total: data.length,
      message: "데이터 조회 성공",
    })
  } catch (error) {
    console.error("❌ API 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}

// POST: 새 리뷰 추가 (API 엔드포인트용)
export async function POST(request: NextRequest) {
  try {
    console.log("📝 새 리뷰 추가 시작")

    const data = await request.json()
    console.log("받은 데이터:", data)

    const { data: insertedData, error } = await supabase.from("reviews").insert([data]).select()

    if (error) {
      console.error("❌ 데이터 저장 실패:", error)
      return NextResponse.json({ success: false, message: "저장 실패", error: error.message }, { status: 500 })
    }

    console.log("✅ 데이터 저장 성공:", insertedData[0]?.id)

    return NextResponse.json({
      success: true,
      message: "저장 성공",
      data: insertedData[0],
    })
  } catch (error) {
    console.error("❌ API 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
