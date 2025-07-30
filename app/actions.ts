"use server"

import { getKv } from "@/lib/kv" // 수정: kv 대신 getKv 함수를 가져옵니다.
import { revalidatePath } from "next/cache"

export async function submitReview(prevState: any, formData: FormData) {
  // 함수가 호출될 때마다 getKv()를 통해 클라이언트 인스턴스를 얻습니다.
  const kv = getKv()

  try {
    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      majorJob: formData.get("majorJob") as string,
      subJob: formData.get("subJob") as string,
      reviews: JSON.parse(formData.get("reviews") as string),
    }

    const reviewId = crypto.randomUUID()

    // kv.set을 사용하여 데이터를 저장합니다.
    await kv.set(`review:${reviewId}`, rawFormData)

    console.log("🎉 Vercel KV에 데이터 저장 성공! ID:", reviewId)

    revalidatePath("/")

    return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
  } catch (error) {
    // 에러가 발생하면 콘솔에 상세 정보를 출력합니다.
    console.error("❌ Vercel KV에 데이터 저장 실패:", error)
    return { success: false, message: "데이터 제출 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }
  }
}
