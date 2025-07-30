import { type NextRequest, NextResponse } from "next/server"
import { getKv } from "@/lib/kv"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const kv = getKv()

    const id = crypto.randomUUID()
    await kv.set(`review:${id}`, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: "저장 실패" }, { status: 500 })
  }
}
