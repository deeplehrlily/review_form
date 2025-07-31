import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 파일 업로드 함수
export async function uploadFile(file: File, fileName: string) {
  const { data, error } = await supabase.storage.from("proof-documents").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw error
  }

  // 공개 URL 가져오기
  const { data: urlData } = supabase.storage.from("proof-documents").getPublicUrl(fileName)

  return urlData.publicUrl
}

// 파일 삭제 함수
export async function deleteFile(fileName: string) {
  const { error } = await supabase.storage.from("proof-documents").remove([fileName])

  if (error) {
    throw error
  }
}
