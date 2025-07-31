"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, RefreshCw, Eye, Trash2, Search, Users, Building2, Star, TrendingUp } from "lucide-react"
import { supabase, type ReviewData } from "@/lib/supabase"

export default function AdminPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [filteredReviews, setFilteredReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCompany, setFilterCompany] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null)

  const [stats, setStats] = useState({
    totalReviews: 0,
    totalCompanies: 0,
    avgWorkEnvironment: 0,
    avgSalaryWelfare: 0,
    sourceCounts: {} as Record<string, number>,
    companyCounts: {} as Record<string, number>,
  })

  // 데이터 조회
  const fetchReviews = async () => {
    setLoading(true)
    try {
      console.log("📊 관리자 페이지: 데이터 조회 시작")

      const { data, error } = await supabase.from("reviews").select("*").order("submitted_at", { ascending: false })

      if (error) {
        console.error("❌ 데이터 조회 실패:", error)
        alert(`데이터 조회 실패: ${error.message}`)
        return
      }

      console.log(`✅ 총 ${data.length}개의 리뷰 조회 성공`)
      setReviews(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("❌ 데이터 조회 중 오류:", error)
      alert("데이터 조회 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 통계 계산
  const calculateStats = (reviewsData: ReviewData[]) => {
    const totalReviews = reviewsData.length
    const companies = new Set(reviewsData.map((r) => r.company).filter(Boolean))
    const totalCompanies = companies.size

    let workEnvSum = 0
    let salarySum = 0
    let workEnvCount = 0
    let salaryCount = 0
    const sourceCounts: Record<string, number> = {}
    const companyCounts: Record<string, number> = {}

    reviewsData.forEach((review) => {
      // 유입 경로 통계
      if (review.source) {
        sourceCounts[review.source] = (sourceCounts[review.source] || 0) + 1
      }

      // 회사별 통계
      if (review.company) {
        companyCounts[review.company] = (companyCounts[review.company] || 0) + 1
      }

      // 평점 통계
      if (review.reviews) {
        if (review.reviews.work_env?.rating) {
          const rating = Number.parseInt(review.reviews.work_env.rating)
          if (!isNaN(rating)) {
            workEnvSum += rating
            workEnvCount++
          }
        }

        if (review.reviews.salary_welfare?.rating) {
          const rating = Number.parseInt(review.reviews.salary_welfare.rating)
          if (!isNaN(rating)) {
            salarySum += rating
            salaryCount++
          }
        }
      }
    })

    setStats({
      totalReviews,
      totalCompanies,
      avgWorkEnvironment: workEnvCount > 0 ? workEnvSum / workEnvCount : 0,
      avgSalaryWelfare: salaryCount > 0 ? salarySum / salaryCount : 0,
      sourceCounts,
      companyCounts,
    })
  }

  // 필터링
  useEffect(() => {
    let filtered = reviews

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 회사 필터
    if (filterCompany !== "all") {
      filtered = filtered.filter((review) => review.company === filterCompany)
    }

    // 유입 경로 필터
    if (filterSource !== "all") {
      filtered = filtered.filter((review) => review.source === filterSource)
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, filterCompany, filterSource])

  // 리뷰 삭제
  const deleteReview = async (id: string) => {
    if (!confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return

    try {
      console.log("🗑️ 리뷰 삭제 시작:", id)

      const { error } = await supabase.from("reviews").delete().eq("id", id)

      if (error) {
        console.error("❌ 삭제 실패:", error)
        alert(`삭제 실패: ${error.message}`)
        return
      }

      console.log("✅ 리뷰 삭제 성공")
      alert("삭제되었습니다.")
      fetchReviews() // 데이터 새로고침
    } catch (error) {
      console.error("❌ 삭제 중 오류:", error)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  // CSV 다운로드
  const downloadCSV = () => {
    console.log("📥 CSV 다운로드 시작")

    const headers = [
      "ID",
      "제출일시",
      "이름",
      "이메일",
      "전화번호",
      "학력",
      "유입경로",
      "회사명",
      "우편번호",
      "도로명주소",
      "상세주소",
      "근무형태",
      "주요직무",
      "세부직무",
      "시작년도",
      "시작월",
      "종료년도",
      "종료월",
      "근무환경_별점",
      "근무환경_후기",
      "근무강도_별점",
      "근무강도_후기",
      "급여복지_별점",
      "급여복지_후기",
      "안정성전망_별점",
      "안정성전망_후기",
      "사람들_별점",
      "사람들_후기",
      "취업준비_난이도",
      "취업준비_후기",
      "면접준비_난이도",
      "면접준비_후기",
      "조언",
      "증빙자료URL",
      "개인정보동의",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredReviews.map((review) =>
        [
          review.id,
          new Date(review.submitted_at).toLocaleString("ko-KR"),
          review.name,
          review.email,
          review.phone,
          review.education,
          review.source,
          review.company,
          review.postcode,
          review.road_address,
          review.detail_address,
          review.work_type,
          review.major_job,
          review.sub_job,
          review.start_date_year,
          review.start_date_month,
          review.end_date_year,
          review.end_date_month,
          review.reviews?.work_env?.rating || "",
          review.reviews?.work_env?.text || "",
          review.reviews?.work_intensity?.rating || "",
          review.reviews?.work_intensity?.text || "",
          review.reviews?.salary_welfare?.rating || "",
          review.reviews?.salary_welfare?.text || "",
          review.reviews?.stability_prospects?.rating || "",
          review.reviews?.stability_prospects?.text || "",
          review.reviews?.people?.rating || "",
          review.reviews?.people?.text || "",
          review.reviews?.job_prep?.difficulty || "",
          review.reviews?.job_prep?.text || "",
          review.reviews?.interview_prep?.difficulty || "",
          review.reviews?.interview_prep?.text || "",
          review.reviews?.advice?.text || "",
          review.proof_url || "",
          review.agree_privacy ? "동의" : "미동의",
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reviews_${new Date().toISOString().split("T")[0]}.csv`
    link.click()

    console.log("✅ CSV 다운로드 완료")
  }

  // 유입 경로 라벨
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

  // 학력 라벨
  const getEducationLabel = (education: string) => {
    const educationMap: Record<string, string> = {
      highschool: "고졸",
      college: "초대졸",
      university: "대졸",
    }
    return educationMap[education] || education
  }

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchReviews()
  }, [])

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 고유 회사 목록
  const uniqueCompanies = [...new Set(reviews.map((r) => r.company).filter(Boolean))]
  const uniqueSources = [...new Set(reviews.map((r) => r.source).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 관리자 대시보드</h1>
            <p className="text-gray-600 mt-1">Supabase 기반 안정적인 데이터 관리</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchReviews} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              새로고침
            </Button>
            <Button onClick={downloadCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              CSV 다운로드 ({filteredReviews.length}개)
            </Button>
          </div>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />총 리뷰 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalReviews}</div>
              <p className="text-xs text-gray-500 mt-1">전체 제출된 리뷰</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                참여 기업 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCompanies}</div>
              <p className="text-xs text-gray-500 mt-1">리뷰가 등록된 기업</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                근무환경 평균
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.avgWorkEnvironment.toFixed(1)}
                <span className="text-sm text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">전체 평균 점수</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                급여복지 평균
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.avgSalaryWelfare.toFixed(1)}
                <span className="text-sm text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">전체 평균 점수</p>
            </CardContent>
          </Card>
        </div>

        {/* 유입 경로 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📈 유입 경로별 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.sourceCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => (
                  <Badge key={source} variant="secondary" className="text-sm">
                    {getSourceLabel(source)}: {count}명
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              검색 및 필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="이름, 회사명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="회사별 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 회사</SelectItem>
                    {uniqueCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company} ({stats.companyCounts[company] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="유입경로별 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 경로</SelectItem>
                    {uniqueSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {getSourceLabel(source)} ({stats.sourceCounts[source] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              총 {reviews.length}개 중 {filteredReviews.length}개 표시
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>📝 리뷰 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">제출일시</th>
                    <th className="text-left p-3 font-medium">이름</th>
                    <th className="text-left p-3 font-medium">회사명</th>
                    <th className="text-left p-3 font-medium">유입경로</th>
                    <th className="text-left p-3 font-medium">학력</th>
                    <th className="text-left p-3 font-medium">근무형태</th>
                    <th className="text-left p-3 font-medium">근무기간</th>
                    <th className="text-left p-3 font-medium">근무환경</th>
                    <th className="text-left p-3 font-medium">급여복지</th>
                    <th className="text-left p-3 font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        {new Date(review.submitted_at).toLocaleDateString("ko-KR")}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(review.submitted_at).toLocaleTimeString("ko-KR")}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{review.name}</td>
                      <td className="p-3">{review.company}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {getSourceLabel(review.source)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {getEducationLabel(review.education)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {review.work_type}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs">
                        {review.start_date_year}/{review.start_date_month}
                        <br />~ {review.end_date_year}/{review.end_date_month}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {review.reviews?.work_env?.rating || "-"}점
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {review.reviews?.salary_welfare?.rating || "-"}점
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedReview(review)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{selectedReview?.name}님의 리뷰 상세보기</DialogTitle>
                              </DialogHeader>
                              {selectedReview && (
                                <div className="space-y-6">
                                  {/* 기본 정보 */}
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-lg border-b pb-1">👤 개인정보</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <strong>이름:</strong> {selectedReview.name}
                                        </p>
                                        <p>
                                          <strong>이메일:</strong> {selectedReview.email}
                                        </p>
                                        <p>
                                          <strong>전화번호:</strong> {selectedReview.phone}
                                        </p>
                                        <p>
                                          <strong>학력:</strong> {getEducationLabel(selectedReview.education)}
                                        </p>
                                        <p>
                                          <strong>유입경로:</strong> {getSourceLabel(selectedReview.source)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-lg border-b pb-1">🏢 회사정보</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <strong>회사명:</strong> {selectedReview.company}
                                        </p>
                                        <p>
                                          <strong>주소:</strong> {selectedReview.road_address}{" "}
                                          {selectedReview.detail_address}
                                        </p>
                                        <p>
                                          <strong>우편번호:</strong> {selectedReview.postcode}
                                        </p>
                                        <p>
                                          <strong>근무형태:</strong> {selectedReview.work_type}
                                        </p>
                                        <p>
                                          <strong>직무:</strong> {selectedReview.major_job} - {selectedReview.sub_job}
                                        </p>
                                        <p>
                                          <strong>근무기간:</strong> {selectedReview.start_date_year}.
                                          {selectedReview.start_date_month} ~ {selectedReview.end_date_year}.
                                          {selectedReview.end_date_month}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* 리뷰 내용 */}
                                  <div>
                                    <h4 className="font-semibold text-lg mb-4 border-b pb-1">📝 리뷰 내용</h4>
                                    <div className="grid gap-4">
                                      {Object.entries(selectedReview.reviews || {}).map(
                                        ([key, review]: [string, any]) => (
                                          <div key={key} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                              <h5 className="font-medium capitalize">{key.replace("_", " ")}</h5>
                                              <div className="flex gap-2">
                                                {review.rating && (
                                                  <Badge variant="secondary">⭐ {review.rating}점</Badge>
                                                )}
                                                {review.difficulty && (
                                                  <Badge variant="secondary">📊 {review.difficulty}</Badge>
                                                )}
                                              </div>
                                            </div>
                                            {review.text && (
                                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.text}</p>
                                            )}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>

                                  {/* 증빙 자료 */}
                                  {selectedReview.proof_url && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-semibold text-lg mb-2 border-b pb-1">📎 증빙자료</h4>
                                        <a
                                          href={selectedReview.proof_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                        >
                                          <Eye className="h-4 w-4" />
                                          증빙자료 보기
                                        </a>
                                      </div>
                                    </>
                                  )}

                                  {/* 메타 정보 */}
                                  <Separator />
                                  <div className="text-xs text-gray-500 space-y-1">
                                    <p>
                                      <strong>제출일시:</strong>{" "}
                                      {new Date(selectedReview.submitted_at).toLocaleString("ko-KR")}
                                    </p>
                                    <p>
                                      <strong>개인정보 동의:</strong> {selectedReview.agree_privacy ? "동의" : "미동의"}
                                    </p>
                                    <p>
                                      <strong>ID:</strong> {selectedReview.id}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteReview(review.id!)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>조건에 맞는 리뷰가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
