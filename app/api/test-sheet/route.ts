import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET() {
  try {
    console.log("🔍 환경변수 체크:")
    console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID)
    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL)

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

    const sheets = google.sheets({ version: "v4", auth })

    // 간단한 테스트 데이터
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["테스트", new Date().toISOString(), "작동함"]],
      },
    })

    return NextResponse.json({
      success: true,
      message: "테스트 성공!",
      data: response.data,
    })
  } catch (error: any) {
    console.error("에러:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.data || error,
    })
  }
}
