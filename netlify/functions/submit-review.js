const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    const data = JSON.parse(event.body)

    console.log("📝 리뷰 제출 요청:", {
      name: data.name,
      company: data.company,
      proofFiles: data.proofUrls?.length || 0,
    })

    // Supabase에 데이터 삽입
    const { data: insertData, error } = await supabase.from("reviews").insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        education: data.education,
        source: data.source,
        company: data.company,
        postcode: data.postcode,
        road_address: data.roadAddress,
        detail_address: data.detailAddress,
        work_type: data.workType,
        major_job: data.majorJob,
        sub_job: data.subJob,
        start_date: data.startDate,
        end_date: data.endDate,
        reviews: data.reviews,
        proof_urls: data.proofUrls || [],
        submitted_at: data.submittedAt,
        agree_privacy: data.agreePrivacy,
      },
    ])

    if (error) {
      console.error("❌ Supabase 삽입 오류:", error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Database error: " + error.message,
        }),
      }
    }

    console.log("✅ 리뷰 저장 성공:", insertData)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "리뷰가 성공적으로 저장되었습니다.",
      }),
    }
  } catch (error) {
    console.error("❌ 서버 오류:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Server error: " + error.message,
      }),
    }
  }
}
