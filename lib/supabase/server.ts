import { createClient } from "@supabase/supabase-js"

export const createSupabaseServerClient = () => {
  // 2단계에서 설정한 Vercel 환경 변수를 여기서 사용합니다.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase URL or service role key is not defined in environment variables.")
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
