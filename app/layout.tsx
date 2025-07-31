import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "디맨드 근무 후기 이벤트",
  description: "근무 후기를 남기고 특별한 혜택을 받아보세요",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Netlify Forms를 위한 숨겨진 폼 */}
        <form name="review-form" netlify netlify-honeypot="bot-field" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="tel" name="phone" />
          <input type="text" name="education" />
          <input type="text" name="source" />
          <input type="text" name="company" />
          <input type="text" name="postcode" />
          <input type="text" name="roadAddress" />
          <input type="text" name="detailAddress" />
          <input type="text" name="workType" />
          <input type="text" name="majorJob" />
          <input type="text" name="subJob" />
          <input type="text" name="startYear" />
          <input type="text" name="startMonth" />
          <input type="text" name="endYear" />
          <input type="text" name="endMonth" />
          <input type="text" name="workEnvironmentRating" />
          <input type="text" name="workEnvironmentDifficulty" />
          <textarea name="workEnvironmentText"></textarea>
          <input type="text" name="salaryWelfareRating" />
          <input type="text" name="salaryWelfareDifficulty" />
          <textarea name="salaryWelfareText"></textarea>
          <input type="text" name="workLifeBalanceRating" />
          <input type="text" name="workLifeBalanceDifficulty" />
          <textarea name="workLifeBalanceText"></textarea>
          <input type="text" name="cultureRating" />
          <input type="text" name="cultureDifficulty" />
          <textarea name="cultureText"></textarea>
          <input type="text" name="growthRating" />
          <input type="text" name="growthDifficulty" />
          <textarea name="growthText"></textarea>
          <input type="text" name="recommendationDifficulty" />
          <textarea name="recommendationText"></textarea>
          <textarea name="advice"></textarea>
          <input type="checkbox" name="agreePrivacy" />
          <input type="file" name="proofFile1" />
          <input type="file" name="proofFile2" />
          <input type="file" name="proofFile3" />
          <input type="file" name="proofFile4" />
          <input type="file" name="proofFile5" />
          <input type="text" name="submittedAt" />
        </form>
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
