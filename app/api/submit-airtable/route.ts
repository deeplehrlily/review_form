import { type NextRequest, NextResponse } from "next/server"

// 에어테이블 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = "Reviews" // 테이블 이름

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          이름: formData.name,
          이메일: formData.email,
          전화번호: formData.phone,
          회사명: formData.company,
          주소: `${formData.roadAddress} ${formData.detailAddress}`,
          직무대분류: formData.majorJob,
          직무소분류: formData.subJob,
          근무기간: `${formData.startDate.year}-${formData.startDate.month} ~ ${formData.endDate.year}-${formData.endDate.month}`,
          근무환경평점: formData.reviews.work_env?.rating,
          근무강도평점: formData.reviews.work_intensity?.rating,
          급여복지평점: formData.reviews.salary_welfare?.rating,
          안정성전망평점: formData.reviews.stability_prospects?.rating,
          사람들평점: formData.reviews.people?.rating,
          취업준비난이도: formData.reviews.job_prep?.difficulty,
          면접준비난이도: formData.reviews.interview_prep?.difficulty,
          조언: formData.reviews.advice?.text,
          제출시간: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`에어테이블 API 오류: ${response.status}`)
    }

    const result = await response.json()
    console.log("✅ 에어테이블 저장 성공:", result.id)

    return NextResponse.json({
      success: true,
      message: "성공적으로 제출되었습니다!",
    })
  } catch (error) {
    console.error("❌ 에어테이블 저장 실패:", error)
    return NextResponse.json(
      {
        success: false,
        message: "제출 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
