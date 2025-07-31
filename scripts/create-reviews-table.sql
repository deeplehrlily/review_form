-- 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  education VARCHAR(50),
  source VARCHAR(50),
  company VARCHAR(200) NOT NULL,
  postcode VARCHAR(10),
  road_address TEXT,
  detail_address TEXT,
  work_type VARCHAR(50),
  major_job VARCHAR(100),
  sub_job VARCHAR(100),
  start_date_year INTEGER,
  start_date_month INTEGER,
  end_date_year INTEGER,
  end_date_month INTEGER,
  reviews JSONB,
  proof_urls TEXT[],
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agree_privacy BOOLEAN DEFAULT false
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reviews_company ON reviews(company);
CREATE INDEX IF NOT EXISTS idx_reviews_submitted_at ON reviews(submitted_at);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);

-- Storage 버킷 생성 (이미 존재하지 않는 경우)
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof-documents', 'proof-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책 설정
CREATE POLICY "Anyone can upload proof documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'proof-documents');

CREATE POLICY "Anyone can view proof documents" ON storage.objects
FOR SELECT USING (bucket_id = 'proof-documents');

CREATE POLICY "Anyone can delete their proof documents" ON storage.objects
FOR DELETE USING (bucket_id = 'proof-documents');
