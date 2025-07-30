import { createClient } from "@vercel/kv"

// 애플리케이션이 시작될 때 환경 변수가 있는지 확인합니다.
// 사용자께서 제공해주신 정확한 환경 변수 이름을 사용합니다.
if (!process.env.review_form_KV_REST_API_URL || !process.env.review_form_KV_REST_API_TOKEN) {
  console.error("❌ 치명적 오류: review_form_KV_REST_API_URL 또는 review_form_KV_REST_API_TOKEN 환경 변수가 없습니다!")
  // 이 오류 메시지는 빌드 로그나 서버리스 함수 로그에 나타납니다.
  throw new Error(
    "KV_REST_API_URL과 KV_REST_API_TOKEN 환경 변수를 찾을 수 없습니다. Vercel 프로젝트 설정을 확인해주세요.",
  )
}

// 사용자의 환경 변수를 사용하여 KV 클라이언트를 생성하고 내보냅니다.
export const kv = createClient({
  url: process.env.review_form_KV_REST_API_URL,
  token: process.env.review_form_KV_REST_API_TOKEN,
})

console.log("✅ KV 클라이언트가 커스텀 환경 변수로 성공적으로 초기화되었습니다.")
