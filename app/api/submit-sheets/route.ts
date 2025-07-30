import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // 환경변수 확인
    console.log("🔍 환경변수 확인:")
    console.log("- GOOGLE_PROJECT_ID:", process.env.GOOGLE_PROJECT_ID ? "✅ 있음" : "❌ 없음")
    console.log("- GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL ? "✅ 있음" : "❌ 없음")
    console.log("- GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID ? "✅ 있음" : "❌ 없음")
    console.log("- GOOGLE_PRIVATE_KEY:", process.env.GOOGLE_PRIVATE_KEY ? "✅ 있음" : "❌ 없음")

    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID 환경변수가 없습니다")
    }

    // 구글 서비스 계정 인증
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("🔑 인증 객체 생성 완료")

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    console.log("📊 시트 ID:", spreadsheetId)

    // 현재 시간
    const now = new Date()
    const timestamp = now.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })

    // 테스트 데이터 먼저 추가
    const testValues = [
      [
        timestamp,
        "테스트",
        "test@test.com",
        "010-1234-5678",
        "테스트 경로",
        "대졸",
        "테스트 회사",
        "서울시 강남구",
        "현직장",
        "IT",
        "개발자",
        "2024-01",
        "2024-12",
        "5",
        "좋음",
        "4",
        "보통",
        "3",
        "나쁨",
        "5",
        "좋음",
        "4",
        "보통",
        "3",
        "어려움",
        "취업 준비 후기",
        "2",
        "면접 준비 후기",
        "조언 내용",
      ],
    ]

    console.log("📝 추가할 데이터:", testValues[0].slice(0, 5), "...")

    // 구글 시트에 데이터 추가 시도
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A:AB",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: testValues,
      },
    })

    console.log("✅ 구글 시트 응답:", response.data)
    console.log("📊 업데이트된 행 수:", response.data.updates?.updatedRows)

    return NextResponse.json({
      success: true,
      message: "테스트 데이터가 성공적으로 추가되었습니다!",
      debug: {
        updatedRows: response.data.updates?.updatedRows,
        updatedRange: response.data.updates?.updatedRange,
      },
    })
  } catch (error) {
    console.error("❌ 상세 에러:", error)
    return NextResponse.json(
      {
        success: false,
        message: `에러: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
        error: error instanceof Error ? error.stack : error,
      },
      { status: 500 },
    )
  }
}
