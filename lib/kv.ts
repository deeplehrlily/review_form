import { Redis } from "@upstash/redis"

// 클라이언트 인스턴스를 저장할 변수를 선언합니다. (아직 생성하지 않음)
let kvClient: Redis | null = null

/**
 * 필요할 때 KV 클라이언트 인스턴스를 생성하고 반환하는 함수입니다.
 * 한번 생성된 인스턴스는 재사용하여 효율성을 높입니다. (싱글톤 패턴)
 */
export function getKv() {
  // 이미 인스턴스가 있다면 즉시 반환합니다.
  if (kvClient) {
    return kvClient
  }

  // 인스턴스가 없을 때만 새로 생성합니다.
  // 이 코드는 서버 액션 내부에서 호출되므로, 환경 변수가 보장됩니다.
  const url = process.env.review_form_KV_REST_API_URL
  const token = process.env.review_form_KV_REST_API_TOKEN

  if (!url || !token) {
    const errorMessage =
      "❌ 치명적 오류: 'review_form_KV_REST_API_URL' 또는 'review_form_KV_REST_API_TOKEN' 환경 변수를 찾을 수 없습니다. Vercel 프로젝트 설정을 다시 확인해주세요."
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  console.log("✅ KV 환경 변수 확인 완료. Upstash Redis 클라이언트를 생성합니다.")

  // @upstash/redis 라이브러리로 클라이언트를 생성합니다.
  kvClient = new Redis({
    url: url,
    token: token,
  })

  console.log("✅ Upstash Redis 클라이언트가 성공적으로 생성되었습니다.")
  return kvClient
}
