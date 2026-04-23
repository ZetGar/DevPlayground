import { User } from "@supabase/supabase-js";

// 1. SQL의 stage 컬럼과 동일하게 정의
export type JobStage = '서류' | '면접' | '과제' | '합격' | '불합격';

// 2. 실제 applications 테이블 구조 반영
export interface Job {
  id: string;
  user_id: string;
  company_name: string; // 회사명
  job_title: string;    // 포지션
  stage: JobStage;      // 상태 (서류, 면접 등)
  applied_at: string;   // 지원 날짜
  ai_guide?: AiGuide;  // AI 면접 가이드
  domain: string;       // 도메인
  job_url?: string;     // 공고 URL
  company_size: string; // 기업 규모
  url?: string;         // 공고 링크
  created_at?: string;
}

// 3. UI에 표시할 텍스트 매핑
export const STATUS_TEXT: Record<JobStage, string> = {
  '서류': "서류 전형",
  '면접': "면접 진행",
  '과제': "과제/테스트",
  '합격': "최종 합격",
  '불합격': "불합격",
};

export interface JobLogClientProps {
  user: User | null;
  isGuest: boolean;
}

// 매핑 테이블 정의
export const STATUS_CLASS_MAP = {
  '서류': 'applied',
  '서류전형': 'applied',
  '면접': 'interview',
  '면접진행': 'interview',
  '과제': 'task',
  '합격': 'passed',
  '최종합격': 'passed',
  '불합격': 'rejected',
} as const;

export interface AiGuide {
  checkpoints: {
    id: number;
    task: string;
    done: boolean;
  }[];
  expected_questions: string[];
  tip: string;
  strategies?: InterviewStrategy[]; 
}

export interface InterviewStrategy {
  scenario: string;
  question: string;
  intent: string;
  best_answer_tip: string;
}