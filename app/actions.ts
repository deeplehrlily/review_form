"use server"

import { getKv } from "@/lib/kv"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function submitReview(prevState: any, formData: FormData) {
  const kv = getKv()

  try {
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

    // 2. FormData를 일반 객체로 변환하여 모든 필드를 안정적으로 받습니다.
    const data = Object.fromEntries(formData)

    // 3. DB에 저장할 최종 데이터 객체 구성
    const reviewData = {
      // 개인 정보
      name: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      education: data.education as string,
      source: data.source as string,

      // 회사 정보
      company: data.company as string,
      postcode: data.postcode as string,
      roadAddress: data.roadAddress as string,
      detailAddress: data.detailAddress as string,
      workType: data.workType as string,
      majorJob: data.majorJob as string,
      subJob: data.subJob as string,
      startDate: {
        year: data.startDateYear as string,
        month: data.startDateMonth as string,
      },
      endDate: {
        year: data.endDateYear as string,
        month: data.endDateMonth as string,
      },

      // 리뷰 내용 (JSON 문자열을 객체로 변환)
      reviews: JSON.parse(data.reviews as string),

      // 인증 자료 URL
      proofUrl: proofUrl,

      // 메타 정보
      submittedAt: new Date().toISOString(),
      agreePrivacy: data.agreePrivacy === "true",
    }

    // 4. Vercel KV에 데이터 저장
    const reviewId = crypto.randomUUID()
    await kv.set(`review:${reviewId}`, reviewData)

    console.log("🎉 Vercel KV에 데이터 저장 성공! ID:", reviewId)

    // 캐시를 갱신하여 변경사항이 즉시 반영되도록 합니다.
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
