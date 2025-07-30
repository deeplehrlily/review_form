"use server"

import Airtable from "airtable"
import { jobData } from "@/lib/job-data"

export async function submitReview(prevState: any, formData: FormData) {
  console.log("✅ [Airtable Action] submitReview 시작됨")

  if (!process.env.AIRTABLE_PAT || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
    const errorMessage =
      "❌ [Airtable Action] Airtable 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME을 확인해주세요."
    console.error(errorMessage)
    return { success: false, message: "서버 설정 오류가 발생했습니다. 관리자에게 문의하세요." }
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID)
  const tableName = process.env.AIRTABLE_TABLE_NAME

  try {
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
    }
    console.log("📄 [Airtable Action] 폼 데이터 파싱 완료:", { name: rawFormData.name, email: rawFormData.email })

    const majorJobName = jobData.majorCategories[rawFormData.majorJobCode] || "알 수 없음"
    const subJobName =
      jobData.subCategories[rawFormData.majorJobCode]?.find((job) => job.code === rawFormData.subJobCode)?.name ||
      "알 수 없음"

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
      reviews_data: JSON.stringify(rawFormData.reviews, null, 2),
    }
    console.log("💾 [Airtable Action] DB에 삽입할 데이터 준비 완료:", fieldsToInsert)

    console.log(`⏳ [Airtable Action] '${tableName}' 테이블에 데이터 삽입 시도 중...`)
    await base(tableName).create([{ fields: fieldsToInsert }])

    console.log("🎉 [Airtable Action] DB 삽입 성공! 작업 완료.")
    return { success: true, message: "소중한 후기를 남겨주셔서 감사합니다! 성공적으로 제출되었습니다." }
  } catch (error) {
    // 에러 객체를 전체 문자열로 로깅하여 더 자세한 정보 확인
    const fullError = JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    console.error("❌ [Airtable Action] DB 삽입 실패:", fullError)

    // 사용자에게 보여줄 메시지
    let userMessage = "데이터 제출 중 오류가 발생했습니다."
    if (error.message.includes("NOT_FOUND")) {
      userMessage = "데이터를 저장할 테이블을 찾을 수 없습니다. 테이블 이름이 정확한지 확인해주세요."
    } else if (error.message.includes("INVALID_PERMISSIONS")) {
      userMessage = "데이터를 저장할 권한이 없습니다. Airtable API 토큰 설정을 확인해주세요."
    } else if (error.message.includes("UNKNOWN_FIELD_NAME")) {
      userMessage =
        "알 수 없는 필드 이름이 포함되어 있습니다. Airtable의 필드명과 코드의 필드명이 일치하는지 확인해주세요."
    }

    return { success: false, message: userMessage }
  }
}
