-- =============================================
-- JobLog Supabase SQL
-- Supabase Dashboard > SQL Editor에서 실행
-- =============================================

-- 1. applications 테이블
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  domain TEXT NOT NULL,
  company_size TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  stage TEXT NOT NULL DEFAULT '서류',
  applied_at DATE NOT NULL,
  deadline DATE,
  url TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. interview_questions 테이블
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  my_answer TEXT DEFAULT '',
  ai_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ai_analyses 테이블
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security) 설정
-- =============================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- applications: 본인 데이터만
CREATE POLICY "applications_select" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "applications_insert" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applications_update" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "applications_delete" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- interview_questions: application 소유자만
CREATE POLICY "interview_questions_select" ON interview_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE id = interview_questions.application_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "interview_questions_insert" ON interview_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE id = interview_questions.application_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "interview_questions_update" ON interview_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE id = interview_questions.application_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "interview_questions_delete" ON interview_questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE id = interview_questions.application_id
      AND user_id = auth.uid()
    )
  );

-- ai_analyses: 본인 데이터만
CREATE POLICY "ai_analyses_select" ON ai_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_analyses_insert" ON ai_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 인덱스
-- =============================================

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_stage ON applications(stage);
CREATE INDEX idx_applications_deadline ON applications(deadline);
CREATE INDEX idx_interview_questions_application_id ON interview_questions(application_id);
CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
