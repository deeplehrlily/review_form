"use server"

import { createClient } from "@vercel/kv"
import { revalidatePath } from "next/cache"

const kv = createClient({
  url: process.env.review_form_KV_URL,
  token: process.env.review_form_KV_TOKEN,

// 이 함수는 서버에서만 실행되므로 안전합니다.
export async function submitReview(prevState: any, formData: FormData) {
  // ✨ 추가된 코드: 환경 변수가 있는지 먼저 확인합니다.
  if (!process.env.review_form_KV_URL || !process.env.review_form_KV_TOKEN) {
    const errorMessage =
      "Vercel KV 환경 변수(review_form_KV_URL, review_form_KV_TOKEN)가 설정되지 않았습니다. Vercel 대시보드에서 Storage 설정을 확인해주세요."
    console.error(`❌ ${errorMessage}`)
    return {
      success: false,
      message: `서버 설정 오류: 데이터베이스 연결 정보가 없습니다. (${new Date().toISOString()})`,
    }
  }

  try {
    // 1. 폼에서 사용자가 입력한 데이터를 가져옵니다.
    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      majorJob: formData.get("majorJob") as string,
      subJob: formData.get("subJob") as string,
      reviews: JSON.parse(formData.get("reviews") as string),
      // 필요한 다른 데이터들도 여기에 추가할 수 있습니다.
    }

    // 2. 고유한 ID를 생성합니다.
    const reviewId = crypto.randomUUID()

    // 3. Vercel KV에 데이터를 저장합니다. 'review:' 접두사를 붙여 나중에 찾기 쉽게 합니다.
    await kv.set(`review:${reviewId}`, rawFormData)

    console.log("🎉 Vercel KV에 데이터 저장 성공! ID:", reviewId)

    // 4. 페이지를 새로고침하여 최신 정보를 반영하도록 합니다.
    revalidatePath("/")

    // 5. 성공 메시지를 프론트엔드로 보냅니다.
    return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
  } catch (error) {
    console.error("❌ Vercel KV에 데이터 저장 실패:", error)
    // 6. 실패 시 에러 메시지를 보냅니다.
    return { success: false, message: "데이터 제출 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }
  }
}
