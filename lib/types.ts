export type Review = {
  id: string // 각 리뷰의 고유 ID (키 값)

  // 개인 정보
  name: string
  email: string
  phone: string
  education: string
  source: string

  // 회사 정보
  company: string
  postcode: string
  roadAddress: string
  detailAddress: string
  workType: string
  majorJob: string
  subJob: string
  startDate: {
    year: string
    month: string
  }
  endDate: {
    year: string
    month: string
  }

  // 리뷰 내용
  reviews: Record<string, { rating?: string; difficulty?: string; text: string }>

  // 인증 자료 URL
  proofUrl: string

  // 메타 정보
  submittedAt: string
  agreePrivacy: boolean
}
