"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Trash2, Eye, Search } from "lucide-react"

export default function AdminPage() {
  const [data, setData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCompany, setFilterCompany] = useState("all") // Updated default value to "all"
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterData()
  }, [data, searchTerm, filterCompany])

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

  const filterData = () => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCompany !== "all") {
      filtered = filtered.filter((item) => item.company === filterCompany)
    }

    setFilteredData(filtered)
    setCurrentPage(1)
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

  const deleteReview = async (reviewId: string) => {
    if (!confirm("정말로 이 후기를 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`/api/admin/delete/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("후기가 삭제되었습니다.")
        fetchData()
      } else {
        alert("삭제 중 오류가 발생했습니다.")
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  const downloadCSV = () => {
    const headers = [
      "제출일시",
      "이름",
      "이메일",
      "전화번호",
      "유입경로",
      "최종학력",
      "회사명",
      "우편번호",
      "도로명주소",
      "상세주소",
      "근무형태",
      "직무대분류",
      "직무소분류",
      "근무시작년월",
      "근무종료년월",
      "근무환경별점",
      "근무강도별점",
      "급여복지별점",
      "안정성전망별점",
      "사람들별점",
      "취업준비난이도",
      "면접준비난이도",
      "근무환경후기",
      "근무강도후기",
      "급여복지후기",
      "안정성전망후기",
      "사람들후기",
      "취업준비후기",
      "면접준비후기",
      "조언",
      "증빙자료URL",
    ]

    const rows = filteredData.map((item) => [
      new Date(item.submittedAt).toLocaleString("ko-KR"),
      item.name || "",
      item.email || "",
      item.phone || "",
      item.source || "",
      item.education || "",
      item.company || "",
      item.postcode || "",
      item.roadAddress || "",
      item.detailAddress || "",
      item.workType || "",
      item.majorJob || "",
      item.subJob || "",
      `${item.startDate?.year || ""}-${item.startDate?.month || ""}`,
      `${item.endDate?.year || ""}-${item.endDate?.month || ""}`,
      item.reviews?.work_env?.rating || "",
      item.reviews?.work_intensity?.rating || "",
      item.reviews?.salary_welfare?.rating || "",
      item.reviews?.stability_prospects?.rating || "",
      item.reviews?.people?.rating || "",
      item.reviews?.job_prep?.difficulty || "",
      item.reviews?.interview_prep?.difficulty || "",
      item.reviews?.work_env?.text || "",
      item.reviews?.work_intensity?.text || "",
      item.reviews?.salary_welfare?.text || "",
      item.reviews?.stability_prospects?.text || "",
      item.reviews?.people?.text || "",
      item.reviews?.job_prep?.text || "",
      item.reviews?.interview_prep?.text || "",
      item.reviews?.advice?.text || "",
      item.proofUrl || "",
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reviews_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const getSourceLabel = (source: string) => {
    const sourceMap: Record<string, string> = {
      homepage: "디맨드 홈페이지",
      instagram: "디맨드 인스타그램",
      threads: "디맨드 스레드",
      chat: "디맨드 오픈채팅방",
      ig_ad: "인스타그램 광고",
      blog: "디맨드 블로그",
      etc: "기타",
    }
    return sourceMap[source] || source
  }

  const getEducationLabel = (education: string) => {
    const educationMap: Record<string, string> = {
      highschool: "고졸",
      college: "초대졸",
      university: "대졸",
    }
    return educationMap[education] || education
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const uniqueCompanies = [...new Set(data.map((item) => item.company))].filter(Boolean)

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
                  {getSourceLabel(source)}: {count as number}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              검색 및 필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="이름, 회사명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-48">
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="회사별 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 회사</SelectItem> {/* Updated value prop to "all" */}
                    {uniqueCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              총 {data.length}개 중 {filteredData.length}개 표시
            </div>
          </CardContent>
        </Card>

        {/* 후기 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>후기 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">제출일시</th>
                    <th className="text-left p-2">이름</th>
                    <th className="text-left p-2">회사명</th>
                    <th className="text-left p-2">유입경로</th>
                    <th className="text-left p-2">학력</th>
                    <th className="text-left p-2">근무형태</th>
                    <th className="text-left p-2">근무기간</th>
                    <th className="text-left p-2">근무환경</th>
                    <th className="text-left p-2">급여복지</th>
                    <th className="text-left p-2">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{new Date(item.submittedAt).toLocaleDateString("ko-KR")}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.company}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {getSourceLabel(item.source)}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {getEducationLabel(item.education)}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {item.workType}
                        </Badge>
                      </td>
                      <td className="p-2 text-xs">
                        {item.startDate?.year}/{item.startDate?.month} ~ {item.endDate?.year}/{item.endDate?.month}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{item.reviews?.work_env?.rating || "-"}점</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{item.reviews?.salary_welfare?.rating || "-"}점</Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedReview(item)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>후기 상세보기 - {selectedReview?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedReview && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">개인정보</h4>
                                      <p>이름: {selectedReview.name}</p>
                                      <p>이메일: {selectedReview.email}</p>
                                      <p>전화번호: {selectedReview.phone}</p>
                                      <p>학력: {getEducationLabel(selectedReview.education)}</p>
                                      <p>유입경로: {getSourceLabel(selectedReview.source)}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">회사정보</h4>
                                      <p>회사명: {selectedReview.company}</p>
                                      <p>
                                        주소: {selectedReview.roadAddress} {selectedReview.detailAddress}
                                      </p>
                                      <p>우편번호: {selectedReview.postcode}</p>
                                      <p>근무형태: {selectedReview.workType}</p>
                                      <p>
                                        근무기간: {selectedReview.startDate?.year}/{selectedReview.startDate?.month} ~{" "}
                                        {selectedReview.endDate?.year}/{selectedReview.endDate?.month}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">리뷰 내용</h4>
                                    {Object.entries(selectedReview.reviews || {}).map(
                                      ([key, review]: [string, any]) => (
                                        <div key={key} className="mb-4 p-3 border rounded">
                                          <h5 className="font-medium">{key}</h5>
                                          {review.rating && <p>별점: {review.rating}점</p>}
                                          {review.difficulty && <p>난이도: {review.difficulty}</p>}
                                          <p className="mt-2 text-sm">{review.text}</p>
                                        </div>
                                      ),
                                    )}
                                  </div>

                                  {selectedReview.proofUrl && (
                                    <div>
                                      <h4 className="font-semibold">증빙자료</h4>
                                      <a
                                        href={selectedReview.proofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        증빙자료 보기
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteReview(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
