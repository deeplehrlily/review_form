-- 1. reviews 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 개인 정보
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  education TEXT,
  source TEXT,
  
  -- 회사 정보
  company TEXT NOT NULL,
  postcode TEXT,
  road_address TEXT,
  detail_address TEXT,
  work_type TEXT,
  major_job TEXT,
  sub_job TEXT,
  start_date_year TEXT,
  start_date_month TEXT,
  end_date_year TEXT,
  end_date_month TEXT,
  
  -- 리뷰 내용 (JSON 형태)
  reviews JSONB NOT NULL DEFAULT '{}',
  
  -- 증빙 자료
  proof_url TEXT,
  
  -- 메타 정보
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agree_privacy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_reviews_company ON reviews(company);
CREATE INDEX IF NOT EXISTS idx_reviews_submitted_at ON reviews(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- 3. RLS (Row Level Security) 설정 - 보안을 위해
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. 정책 생성 - 모든 사용자가 읽기/쓰기 가능 (필요에 따라 수정)
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON reviews FOR DELETE USING (true);

-- 5. 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 트리거 생성
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
