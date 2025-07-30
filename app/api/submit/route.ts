import { type NextRequest, NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const kv = getKv()

    console.log("🚀 받은 데이터:", JSON.stringify(data, null, 2))

    // 완전한 데이터 구조로 저장 - 모든 필드 포함
    const completeData = {
      // 개인 정보
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      education: data.education || "",
      source: data.source || "",

      // 회사 정보
      company: data.company || "",
      postcode: data.postcode || "",
      roadAddress: data.roadAddress || "",
      detailAddress: data.detailAddress || "",
      workType: data.workType || "",
      majorJob: data.majorJob || "",
      subJob: data.subJob || "",

      // 근무 기간
      startDate: {
        year: data.startDate?.year || "",
        month: data.startDate?.month || "",
      },
      endDate: {
        year: data.endDate?.year || "",
        month: data.endDate?.month || "",
      },

      // 리뷰 내용
      reviews: data.reviews || {},

      // 인증 자료 (향후 추가 예정)
      proofUrl: data.proofUrl || "",

      // 메타 정보
      submittedAt: data.submittedAt || new Date().toISOString(),
      agreePrivacy: data.agreePrivacy || false,
    }

    const id = crypto.randomUUID()
    await kv.set(`review:${id}`, completeData)

    console.log("💾 저장된 데이터:", JSON.stringify(completeData, null, 2))
    console.log("✅ 저장 완료! ID:", id)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("❌ 저장 실패:", error)
    return NextResponse.json({ success: false, message: "저장 실패" }, { status: 500 })
  }
}
