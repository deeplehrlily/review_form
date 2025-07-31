const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    // Supabase에서 모든 리뷰 데이터 가져오기
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase 조회 오류:", error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Database error: " + error.message,
        }),
      }
    }

    console.log("✅ 리뷰 조회 성공:", reviews?.length || 0, "개")

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: reviews || [],
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
