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

  // GET 요청만 허용
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    console.log("📊 리뷰 데이터 조회 요청")

    // Supabase에서 모든 리뷰 데이터 조회
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("❌ Supabase 조회 오류:", error)
      throw error
    }

    console.log(`✅ 리뷰 데이터 조회 성공: ${reviews.length}개`)

    // 통계 계산
    const stats = {
      totalReviews: reviews.length,
      totalCompanies: new Set(reviews.map((r) => r.company)).size,
      averageRatings: {
        workEnvironment: 0,
        salaryWelfare: 0,
      },
      sources: {},
    }

    // 평균 평점 계산
    if (reviews.length > 0) {
      const workEnvRatings = reviews
        .map((r) => r.reviews?.workEnvironment?.rating)
        .filter((rating) => rating && rating > 0)

      const salaryRatings = reviews
        .map((r) => r.reviews?.salaryWelfare?.rating)
        .filter((rating) => rating && rating > 0)

      stats.averageRatings.workEnvironment =
        workEnvRatings.length > 0
          ? (workEnvRatings.reduce((sum, rating) => sum + rating, 0) / workEnvRatings.length).toFixed(1)
          : 0

      stats.averageRatings.salaryWelfare =
        salaryRatings.length > 0
          ? (salaryRatings.reduce((sum, rating) => sum + rating, 0) / salaryRatings.length).toFixed(1)
          : 0

      // 유입 경로별 통계
      reviews.forEach((review) => {
        const source = review.source || "기타"
        stats.sources[source] = (stats.sources[source] || 0) + 1
      })
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        reviews,
        stats,
      }),
    }
  } catch (error) {
    console.error("❌ 서버 오류:", error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "서버 오류가 발생했습니다.",
        details: error.message,
      }),
    }
  }
}
