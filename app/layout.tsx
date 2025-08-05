import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "근무 후기 이벤트",
  description: "근무 후기를 작성하고 이벤트에 참여하세요",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* Netlify Forms를 위한 숨겨진 폼 */}
        <form name="demand-review-form" netlify="true" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="text" name="phone" />
          <input type="text" name="source" />
          <input type="text" name="education" />
          <input type="text" name="company" />
          <input type="text" name="postcode" />
          <input type="text" name="roadAddress" />
          <input type="text" name="detailAddress" />
          <input type="text" name="jobCategory" />
          <input type="text" name="jobSubCategory" />
          <input type="text" name="workStartYear" />
          <input type="text" name="workStartMonth" />
          <input type="text" name="workEndYear" />
          <input type="text" name="workEndMonth" />
          <input type="text" name="isCurrentJob" />
          <input type="file" name="proofFile" />

          {/* 리뷰 항목들 */}
          <input type="text" name="근무환경/시설_rating" />
          <input type="text" name="근무환경/시설_text" />
          <input type="text" name="근무강도/스트레스_rating" />
          <input type="text" name="근무강도/스트레스_text" />
          <input type="text" name="급여/복지_rating" />
          <input type="text" name="급여/복지_text" />
          <input type="text" name="안정성/전망_rating" />
          <input type="text" name="안정성/전망_text" />
          <input type="text" name="사람들_rating" />
          <input type="text" name="사람들_text" />
          <input type="text" name="취업준비_difficulty" />
          <input type="text" name="취업준비_text" />
          <input type="text" name="면접준비_difficulty" />
          <input type="text" name="면접준비_text" />

          {/* 8번째 항목 - 이 리뷰의 한줄 요약 */}
          <input type="text" name="이 리뷰의 한줄 요약_text" />
          <input type="text" name="review_summary" />
        </form>

        {children}
      </body>
    </html>
  )
}
