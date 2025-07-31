import type { Handler } from "@netlify/functions"

export const handler: Handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  // POST 요청만 허용
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    // 요청 본문 파싱
    const formData = JSON.parse(event.body || "{}")

    console.log("Received form data:", formData)

    // 여기서 실제 폼 데이터 처리
    // 예: 이메일 발송, 데이터베이스 저장 등

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "폼이 성공적으로 제출되었습니다.",
      }),
    }
  } catch (error) {
    console.error("Form submission error:", error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "서버 오류가 발생했습니다.",
      }),
    }
  }
}
