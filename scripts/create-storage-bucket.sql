-- 증빙 자료 저장을 위한 Storage Bucket 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof-documents', 'proof-documents', true);

-- Storage 정책 설정 (누구나 업로드 가능, 읽기 가능)
CREATE POLICY "Anyone can upload proof documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'proof-documents');

CREATE POLICY "Anyone can view proof documents" ON storage.objects
FOR SELECT USING (bucket_id = 'proof-documents');

CREATE POLICY "Anyone can delete their proof documents" ON storage.objects
FOR DELETE USING (bucket_id = 'proof-documents');
