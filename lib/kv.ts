import { createClient } from "@vercel/kv"

// --- 진단용 로그 시작 ---
console.log("--- KV 클라이언트 초기화 시작 ---")
console.log("Custom URL (review_form_KV_URL):", process.env.review_form_KV_URL ? "✅ 찾음" : "❌ 없음")
console.log("Custom Token (review_form_KV_TOKEN):", process.env.review_form_KV_TOKEN ? "✅ 찾음" : "❌ 없음")
console.log("Default URL (KV_REST_API_URL):", process.env.KV_REST_API_URL ? "✅ 찾음" : "❌ 없음")
console.log("Default Token (KV_REST_API_TOKEN):", process.env.KV_REST_API_TOKEN ? "✅ 찾음" : "❌ 없음")
// --- 진단용 로그 끝 ---

// 애플리케이션이 시작될 때 환경 변수가 있는지 확인합니다.
if (!process.env.review_form_KV_URL || !process.env.review_form_KV_TOKEN) {
  console.error("❌ 치명적 오류: review_form_KV_URL 또는 review_form_KV_TOKEN 환경 변수가 없습니다!")
  throw new Error("KV_URL과 KV_TOKEN 환경 변수를 찾을 수 없습니다. Vercel 프로젝트 설정을 확인해주세요.")
}

// 사용자의 환경 변수를 사용하여 KV 클라이언트를 생성하고 내보냅니다.
export const kv = createClient({
  url: process.env.review_form_KV_URL,
  token: process.env.review_form_KV_TOKEN,
})
