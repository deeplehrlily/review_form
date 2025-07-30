import { createClient } from "@vercel/kv"

// 애플리케이션이 시작될 때 환경 변수가 있는지 확인합니다.
// 만약 변수가 없다면, 더 명확한 에러를 발생시켜 원인을 바로 알 수 있습니다.
if (!process.env.review_form_KV_URL || !process.env.review_form_KV_TOKEN) {
  throw new Error("KV_URL과 KV_TOKEN 환경 변수를 찾을 수 없습니다. Vercel 프로젝트 설정을 확인해주세요.")
}

// 사용자의 환경 변수를 사용하여 KV 클라이언트를 생성하고 내보냅니다.
export const kv = createClient({
  url: process.env.review_form_KV_URL,
  token: process.env.review_form_KV_TOKEN,
})
