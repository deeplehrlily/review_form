"use server"

export async function submitReviewForm(formData: FormData) {
  try {
    // 폼 데이터 추출
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      source: formData.get("source") as string,
      education: formData.get("education") as string,
      company: formData.get("company") as string,
      postcode: formData.get("postcode") as string,
      roadAddress: formData.get("roadAddress") as string,
      detailAddress: formData.get("detailAddress") as string,
      jobCategory: formData.get("jobCategory") as string,
      jobSubCategory: formData.get("jobSubCategory") as string,
      workStartYear: formData.get("workStartYear") as string,
      workStartMonth: formData.get("workStartMonth") as string,
      workEndYear: formData.get("workEndYear") as string,
      workEndMonth: formData.get("workEndMonth") as string,
      isCurrentJob: formData.get("isCurrentJob") as string,
      reviews: formData.get("reviews") as string,
    }

    // 여기서 데이터베이스에 저장하거나 이메일 발송 등 처리
    console.log("Form submitted:", data)

    // 성공 응답
    return { success: true, message: "제출이 완료되었습니다." }
  } catch (error) {
    console.error("Form submission error:", error)
    return { success: false, message: "제출 중 오류가 발생했습니다." }
  }
}
