// Netlify Functions와 통신하기 위한 API 클라이언트
const API_BASE_URL = process.env.NODE_ENV === "production" ? "/.netlify/functions" : "/api"

export async function submitReview(reviewData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Submit review error:", error)
    throw error
  }
}

export async function getReviews(params?: {
  search?: string
  company?: string
  source?: string
  page?: number
  limit?: number
}) {
  try {
    const searchParams = new URLSearchParams()

    if (params?.search) searchParams.append("search", params.search)
    if (params?.company) searchParams.append("company", params.company)
    if (params?.source) searchParams.append("source", params.source)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/get-reviews?${searchParams}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Get reviews error:", error)
    throw error
  }
}
