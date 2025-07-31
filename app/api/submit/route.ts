import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const data = await request.json()

  // 기존 Vercel KV 저장 로직 유지
  const kv = await request.nextUrl.searchParams.get("kv")
  if (kv) {
    // KV 저장 로직 구현
    // 예: await kv.put('key', JSON.stringify(data));
  }

  // 데이터 변환 로직 (필요에 따라 구현)
  const transformedData = data

  // Formtree 전송 로직 추가
  const formtreeResponse = await fetch("https://formtree.com/api/forms/YOUR_FORM_ID/submissions", {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformedData),
  })

  if (formtreeResponse.ok) {
    return NextResponse.json({ message: "Data submitted successfully" })
  } else {
    return NextResponse.json({ message: "Failed to submit data to Formtree" }, { status: 500 })
  }
}
