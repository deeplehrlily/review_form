import { Redis } from "@upstash/redis"

const url = process.env.review_form_KV_REST_API_URL
const token = process.env.review_form_KV_REST_API_TOKEN

// 환경 변수가 제대로 설정되었는지 다시 한번 확인합니다.
if (!url || !token) {
  const errorMessage =
    "❌ 치명적 오류: 'review_form_KV_REST_API_URL' 또는 'review_form_KV_REST_API_TOKEN' 환경 변수가 설정되지 않았습니다. Vercel 프로젝트 설정을 확인해주세요."
  console.error(errorMessage)
  throw new Error(errorMessage)
}

console.log("✅ 커스텀 KV 환경 변수를 찾았습니다. Upstash Redis 클라이언트를 초기화합니다...")

// @upstash/redis 라이브러리를 사용하여 직접 클라이언트를 생성합니다.
// 이 클라이언트는 @vercel/kv와 동일하게 작동하지만, 우리가 지정한 환경 변수를 사용합니다.
export const kv = new Redis({
  url: url,
  token: token,
})

console.log("✅ Upstash Redis 클라이언트가 성공적으로 초기화되었습니다.")
