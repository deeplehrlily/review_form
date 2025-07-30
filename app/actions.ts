"use server"

import { getKv } from "@/lib/kv"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function submitReview(prevState: any, formData: FormData) {
  const kv = getKv()

  try {
    console.log("🚀 서버 액션 시작: 받은 FormData 키 목록")
    for (const key of formData.keys()) {
      console.log(`- ${key}`)
    }

    // 1. 파일 처리 (Vercel Blob 업로드)
    const proofFile = formData.get("proof") as File | null
    let proofUrl = ""
    if (proofFile && proofFile.size > 0) {
      const blob = await put(proofFile.name, proofFile, {
        access: "public",
      })
      proofUrl = blob.url
      console.log("📄 인증 자료 업로드 성공! URL:", proofUrl)
    }

    // 2. FormData에서 각 필드를 개별적으로, 명시적으로 추출하여 안정성을 확보합니다.
    const reviewData = {
      // 개인 정보
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      education: formData.get("education") as string,
      source: formData.get("source") as string,

      // 회사 정보
      company: formData.get("company") as string,
      postcode: formData.get("postcode") as string,
      roadAddress: formData.get("roadAddress") as string,
      detailAddress: formData.get("detailAddress") as string,
      workType: formData.get("workType") as string,
      majorJob: formData.get("majorJob") as string,
      subJob: formData.get("subJob") as string,
      startDate: {
        year: formData.get("startDateYear") as string,
        month: formData.get("startDateMonth") as string,
      },
      endDate: {
        year: formData.get("endDateYear") as string,
        month: formData.get("endDateMonth") as string,
      },

      // 리뷰 내용 (JSON 파싱)
      reviews: JSON.parse(formData.get("reviews") as string),

      // 인증 자료 URL
      proofUrl: proofUrl,

      // 메타 정보
      submittedAt: new Date().toISOString(),
      agreePrivacy: formData.get("agreePrivacy") === "true",
    }

    console.log("✅ DB 저장 전, 파싱된 전체 데이터:", JSON.stringify(reviewData, null, 2))

    // 3. Vercel KV에 데이터 저장
    const reviewId = crypto.randomUUID()
    await kv.set(`review:${reviewId}`, reviewData)

    console.log("🎉 Vercel KV에 데이터 저장 성공! ID:", reviewId)

    revalidatePath("/")

    return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
  } catch (error) {
    console.error("❌ Vercel KV에 데이터 저장 또는 Blob 업로드 실패:", error)
    if (error instanceof Error) {
      return { success: false, message: `데이터 제출 중 서버 오류가 발생했습니다: ${error.message}` }
    }
    return { success: false, message: "데이터 제출 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }
  }
}
