-- [Phase 2 & 3] 기존 스키마 고도화
-- 에너지 컬럼 추가
ALTER TABLE mood_entries
  ADD COLUMN IF NOT EXISTS energy_level INTEGER CHECK (energy_level BETWEEN 0 AND 100);

-- 신체 증상 배열 컬럼 추가
ALTER TABLE mood_entries
  ADD COLUMN IF NOT EXISTS physical_symptoms TEXT[] DEFAULT '{}';

-- 작은 성취 컬럼 추가
ALTER TABLE mood_entries
  ADD COLUMN IF NOT EXISTS small_win TEXT;

-- 맞춤형 응원 메시지 테이블 생성
CREATE TABLE IF NOT EXISTS cheer_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mood_type TEXT,
  energy_range_start INTEGER,
  energy_range_end INTEGER,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- [Security] Row Level Security (RLS) 설정
-- ==========================================

-- 1. profiles (자신의 프로필만 관리)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 2. mood_entries (자신의 기록만 관리)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own entries" ON mood_entries;
CREATE POLICY "Users can manage own entries" ON mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- 3. daily_quotes (모두 읽기 가능, 관리자만 수정)
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read quotes" ON daily_quotes;
CREATE POLICY "Anyone can read quotes" ON daily_quotes
  FOR SELECT USING (true);

-- 4. cheer_messages (모두 읽기 가능, 관리자만 수정)
ALTER TABLE cheer_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read cheer messages" ON cheer_messages;
CREATE POLICY "Anyone can read cheer messages" ON cheer_messages
  FOR SELECT USING (true);

-- 확인용 쿼리 (RLS 활성화 여부 확인)
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
