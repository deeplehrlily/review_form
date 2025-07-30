-- 1. reviews 테이블에 Row Level Security (RLS)를 활성화합니다.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 2. 모든 사용자가 reviews 테이블에 데이터를 삽입(INSERT)할 수 있도록 허용하는 정책을 생성합니다.
CREATE POLICY "Allow public insert for all users"
ON public.reviews
FOR INSERT
WITH CHECK (true);
