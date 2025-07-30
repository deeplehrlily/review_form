"use server"

import Airtable from "airtable"
import { jobData } from "@/lib/job-data"

export async function submitReview(prevState: any, formData: FormData) {
  console.log("✅ [Airtable Action] submitReview 시작됨")

  // 3단계에서 설정한 Vercel 환경 변수를 여기서 사용합니다.
  if (!process.env.AIRTABLE_PAT || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
    console.error("❌ [Airtable Action] Airtable 환경 변수가 설정되지 않았습니다.")
    return { success: false, message: "서버 설정 오류가 발생했습니다." }
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID)
  const tableName = process.env.AIRTABLE_TABLE_NAME

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
    majorJobCode: formData.get("majorJob") as string,
    subJobCode: formData.get("subJob") as string,
    startDateYear: formData.get("startDateYear") as string,
    startDateMonth: formData.get("startDateMonth") as string,
    endDateYear: formData.get("endDateYear") as string,
    endDateMonth: formData.get("endDateMonth") as string,
    reviews: JSON.parse(formData.get("reviews") as string),
    // 파일 업로드는 Airtable Enterprise 플랜이 필요하므로, 여기서는 제외합니다.
    // proof: formData.get("proof") as File,
  }
  console.log("📄 [Airtable Action] 폼 데이터 파싱 완료:", { name: rawFormData.name, email: rawFormData.email })

  // 직무 코드를 이름으로 변환
  const majorJobName = jobData.majorCategories[rawFormData.majorJobCode] || "알 수 없음"
  const subJobName =
    jobData.subCategories[rawFormData.majorJobCode]?.find((job) => job.code === rawFormData.subJobCode)?.name ||
    "알 수 없음"

  // Airtable에 저장할 데이터 필드 준비
  const fieldsToInsert = {
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
    major_job_name: majorJobName,
    sub_job_name: subJobName,
    start_date: `${rawFormData.startDateYear}-${String(rawFormData.startDateMonth).padStart(2, "0")}-01`,
    end_date: `${rawFormData.endDateYear}-${String(rawFormData.endDateMonth).padStart(2, "0")}-01`,
    reviews_data: JSON.stringify(rawFormData.reviews, null, 2), // JSON을 문자열로 저장
  }
  console.log("💾 [Airtable Action] DB에 삽입할 데이터 준비 완료:", fieldsToInsert)

  try {
    console.log(`⏳ [Airtable Action] '${tableName}' 테이블에 데이터 삽입 시도 중...`)
    await base(tableName).create([{ fields: fieldsToInsert }])
    console.log("🎉 [Airtable Action] DB 삽입 성공! 작업 완료.")
    return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
  } catch (error) {
    console.error("❌ [Airtable Action] DB 삽입 실패:", error)
    return { success: false, message: `데이터 제출 실패: ${error.message}` }
  }
}
