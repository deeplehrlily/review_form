"use server"

import { supabase } from "@/lib/supabase"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function submitReview(prevState: any, formData: FormData) {
  try {
    console.log("🚀 서버 액션 시작: Supabase로 데이터 저장")

    // FormData 키 확인
    console.log("📝 받은 FormData 키들:")
    for (const key of formData.keys()) {
      console.log(`  - ${key}: ${formData.get(key)}`)
    }

    // 1. 파일 처리 (Vercel Blob 업로드)
    const proofFile = formData.get("proof") as File | null
    let proofUrl = ""

    if (proofFile && proofFile.size > 0) {
      console.log("📄 파일 업로드 시작:", proofFile.name, proofFile.size, "bytes")
      try {
        const blob = await put(proofFile.name, proofFile, {
          access: "public",
        })
        proofUrl = blob.url
        console.log("✅ 파일 업로드 성공:", proofUrl)
      } catch (error) {
        console.error("❌ 파일 업로드 실패:", error)
        // 파일 업로드 실패해도 폼 제출은 계속 진행
      }
    }

    // 2. FormData에서 데이터 추출
    const reviewsString = formData.get("reviews") as string
    let reviewsData = {}

    try {
      reviewsData = JSON.parse(reviewsString || "{}")
      console.log("✅ 리뷰 데이터 파싱 성공:", reviewsData)
    } catch (error) {
      console.error("❌ 리뷰 데이터 파싱 실패:", error)
      reviewsData = {}
    }

    const reviewData = {
      // 개인 정보
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      education: (formData.get("education") as string) || "",
      source: (formData.get("source") as string) || "",

      // 회사 정보
      company: (formData.get("company") as string) || "",
      postcode: (formData.get("postcode") as string) || "",
      road_address: (formData.get("roadAddress") as string) || "",
      detail_address: (formData.get("detailAddress") as string) || "",
      work_type: (formData.get("workType") as string) || "",
      major_job: (formData.get("majorJob") as string) || "",
      sub_job: (formData.get("subJob") as string) || "",
      start_date_year: (formData.get("startDateYear") as string) || "",
      start_date_month: (formData.get("startDateMonth") as string) || "",
      end_date_year: (formData.get("endDateYear") as string) || "",
      end_date_month: (formData.get("endDateMonth") as string) || "",

      // 리뷰 내용
      reviews: reviewsData,

      // 증빙 자료
      proof_url: proofUrl,

      // 메타 정보
      submitted_at: new Date().toISOString(),
      agree_privacy: formData.get("agreePrivacy") === "true",
    }

    console.log("💾 Supabase에 저장할 데이터:")
    console.log(JSON.stringify(reviewData, null, 2))

    // 3. Supabase에 데이터 저장
    const { data, error } = await supabase.from("reviews").insert([reviewData]).select()

    if (error) {
      console.error("❌ Supabase 저장 실패:", error)
      throw new Error(`데이터베이스 저장 실패: ${error.message}`)
    }

    console.log("🎉 Supabase에 데이터 저장 성공!")
    console.log("저장된 데이터 ID:", data[0]?.id)

    // 페이지 재검증
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다.",
      id: data[0]?.id,
    }
  } catch (error) {
    console.error("❌ 전체 프로세스 실패:", error)

    if (error instanceof Error) {
      return {
        success: false,
        message: `데이터 제출 중 오류가 발생했습니다: ${error.message}`,
      }
    }

    return {
      success: false,
      message: "데이터 제출 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    }
  }
}
