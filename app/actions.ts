"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function submitReview(prevState: any, formData: FormData) {
  console.log("✅ [Server Action] submitReview 시작됨")

  const supabase = createSupabaseServerClient()

  const rawFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    source: formData.get("source") as string,
    education: formData.get("education") as string,
    company: formData.get("company") as string,
    postcode: formData.get("postcode") as string,
    roadAddress: formData.get("roadAddress") as string,
    detailAddress: formData.get("detailAddress") as string,
    workType: formData.get("workType") as string,
    majorJob: formData.get("majorJob") as string,
    subJob: formData.get("subJob") as string,
    startDateYear: formData.get("startDateYear") as string,
    startDateMonth: formData.get("startDateMonth") as string,
    endDateYear: formData.get("endDateYear") as string,
    endDateMonth: formData.get("endDateMonth") as string,
    reviews: JSON.parse(formData.get("reviews") as string),
    proof: formData.get("proof") as File,
  }
  console.log("📄 [Server Action] 폼 데이터 파싱 완료:", {
    name: rawFormData.name,
    email: rawFormData.email,
    hasProofFile: rawFormData.proof && rawFormData.proof.size > 0,
  })

  let proofUrl = null

  // 1. 증빙 자료 파일 업로드 (파일이 있는 경우)
  if (rawFormData.proof && rawFormData.proof.size > 0) {
    console.log("⏳ [Server Action] 파일 업로드 시도 중...")
    const file = rawFormData.proof
    const filePath = `proofs/${uuidv4()}-${file.name}`

    const { error: uploadError } = await supabase.storage.from("proofs").upload(filePath, file)

    if (uploadError) {
      console.error("❌ [Server Action] 파일 업로드 실패:", uploadError)
      return { success: false, message: `파일 업로드 실패: ${uploadError.message}` }
    }

    const { data } = supabase.storage.from("proofs").getPublicUrl(filePath)
    proofUrl = data.publicUrl
    console.log("✅ [Server Action] 파일 업로드 성공! URL:", proofUrl)
  } else {
    console.log("ℹ️ [Server Action] 첨부된 파일 없음.")
  }

  // 2. 데이터베이스에 저장할 데이터 준비
  const startDate = `${rawFormData.startDateYear}-${String(rawFormData.startDateMonth).padStart(2, "0")}-01`
  const endDate = `${rawFormData.endDateYear}-${String(rawFormData.endDateMonth).padStart(2, "0")}-01`

  const dataToInsert = {
    name: rawFormData.name,
    email: rawFormData.email,
    phone: rawFormData.phone,
    source: rawFormData.source,
    education: rawFormData.education,
    company: rawFormData.company,
    postcode: rawFormData.postcode,
    road_address: rawFormData.roadAddress,
    detail_address: rawFormData.detailAddress,
    work_type: rawFormData.workType,
    major_job_code: rawFormData.majorJob,
    sub_job_code: rawFormData.subJob,
    start_date: startDate,
    end_date: endDate,
    reviews_data: rawFormData.reviews,
    proof_url: proofUrl,
  }
  console.log("💾 [Server Action] DB에 삽입할 데이터 준비 완료:", dataToInsert)

  // 3. 데이터베이스에 데이터 삽입
  console.log("⏳ [Server Action] DB에 데이터 삽입 시도 중...")
  const { error: insertError } = await supabase.from("reviews").insert([dataToInsert])

  if (insertError) {
    console.error("❌ [Server Action] DB 삽입 실패:", insertError)
    return { success: false, message: `데이터 제출 실패: ${insertError.message}` }
  }

  console.log("🎉 [Server Action] DB 삽입 성공! 작업 완료.")
  return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
}
