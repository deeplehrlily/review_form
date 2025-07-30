import { type NextRequest, NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function GET(request: NextRequest) {
  try {
    const kv = getKv()

    // 모든 리뷰 키 가져오기
    const keys = await kv.keys("review:*")
    console.log("🔍 총 리뷰 개수:", keys.length)

    // 각 리뷰 데이터 확인
    const allReviews = []
    for (const key of keys) {
      const review = await kv.get(key)
      allReviews.push({
        key,
        data: review,
      })
    }

    // 콘솔에 모든 데이터 출력
    console.log("=== 🗂️ 전체 리뷰 데이터 ===")
    allReviews.forEach((item, index) => {
      console.log(`\n--- 📋 리뷰 ${index + 1} (${item.key}) ---`)
      console.log("📝 저장된 필드들:")
      console.log("👤 name:", item.data?.name)
      console.log("📧 email:", item.data?.email)
      console.log("📞 phone:", item.data?.phone)
      console.log("🔗 source:", item.data?.source)
      console.log("🎓 education:", item.data?.education)
      console.log("🏢 company:", item.data?.company)
      console.log("📮 postcode:", item.data?.postcode)
      console.log("🛣️ roadAddress:", item.data?.roadAddress)
      console.log("🏠 detailAddress:", item.data?.detailAddress)
      console.log("💼 workType:", item.data?.workType)
      console.log("🎯 majorJob:", item.data?.majorJob)
      console.log("🎯 subJob:", item.data?.subJob)
      console.log("📅 startDate:", JSON.stringify(item.data?.startDate))
      console.log("📅 endDate:", JSON.stringify(item.data?.endDate))
      console.log("⭐ reviews keys:", Object.keys(item.data?.reviews || {}))
      console.log("🕐 submittedAt:", item.data?.submittedAt)
      console.log("✅ agreePrivacy:", item.data?.agreePrivacy)
      console.log("🔗 proofUrl:", item.data?.proofUrl)
      console.log("📄 전체 데이터:", JSON.stringify(item.data, null, 2))
    })

    return NextResponse.json({
      success: true,
      message: "콘솔에서 모든 데이터를 확인하세요!",
      totalReviews: keys.length,
      reviews: allReviews,
    })
  } catch (error) {
    console.error("❌ 디버그 실패:", error)
    return NextResponse.json({ success: false, message: "디버그 실패" }, { status: 500 })
  }
}
