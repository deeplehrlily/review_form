"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/data")
      const result = await response.json()
      setData(result.data || [])
      calculateStats(result.data || [])
    } catch (error) {
      console.error("데이터 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviews: any[]) => {
    const stats = {
      total: reviews.length,
      companies: [...new Set(reviews.map((r) => r.company))].length,
      avgRatings: {},
      sources: {},
    }

    // 평균 별점 계산
    const ratings = ["work_env", "work_intensity", "salary_welfare", "stability_prospects", "people"]
    ratings.forEach((rating) => {
      const values = reviews
        .map((r) => r.reviews?.[rating]?.rating)
        .filter((v) => v)
        .map(Number)
      stats.avgRatings[rating] = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0
    })

    // 유입 경로 통계
    reviews.forEach((r) => {
      stats.sources[r.source] = (stats.sources[r.source] || 0) + 1
    })

    setStats(stats)
  }

  const downloadCSV = () => {
    const headers = [
      "제출일시",
      "이름",
      "이메일",
      "회사명",
      "직무대분류",
      "직무소분류",
      "근무환경",
      "근무강도",
      "급여복지",
      "안정성전망",
      "사람들",
      "조언",
    ]

    const rows = data.map((item) => [
      new Date(item.submittedAt).toLocaleString("ko-KR"),
      item.name,
      item.email,
      item.company,
      item.majorJob,
      item.subJob,
      item.reviews?.work_env?.rating || "",
      item.reviews?.work_intensity?.rating || "",
      item.reviews?.salary_welfare?.rating || "",
      item.reviews?.stability_prospects?.rating || "",
      item.reviews?.people?.rating || "",
      item.reviews?.advice?.text || "",
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reviews_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">후기 관리 대시보드</h1>
          <div className="space-x-2">
            <Button onClick={fetchData} variant="outline">
              새로고침
            </Button>
            <Button onClick={downloadCSV}>CSV 다운로드</Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">총 후기 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">참여 회사 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.companies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">평균 근무환경</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgRatings?.work_env || 0}
                <span className="text-sm text-gray-500">/5</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">평균 급여복지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgRatings?.salary_welfare || 0}
                <span className="text-sm text-gray-500">/5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 유입 경로 */}
        <Card>
          <CardHeader>
            <CardTitle>유입 경로</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.sources).map(([source, count]) => (
                <Badge key={source} variant="secondary">
                  {source}: {count as number}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 후기 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 후기 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">제출일시</th>
                    <th className="text-left p-2">이름</th>
                    <th className="text-left p-2">회사명</th>
                    <th className="text-left p-2">근무환경</th>
                    <th className="text-left p-2">급여복지</th>
                    <th className="text-left p-2">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 20).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{new Date(item.submittedAt).toLocaleDateString("ko-KR")}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.company}</td>
                      <td className="p-2">
                        <Badge variant="outline">{item.reviews?.work_env?.rating || "-"}점</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{item.reviews?.salary_welfare?.rating || "-"}점</Badge>
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            alert(`조언: ${item.reviews?.advice?.text || "없음"}`)
                          }}
                        >
                          보기
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
