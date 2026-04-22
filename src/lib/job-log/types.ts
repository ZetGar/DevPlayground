// 지원 단계
export type Stage =
  | "서류"
  | "1차면접"
  | "2차면접"
  | "최종"
  | "합격"
  | "불합격";

// 도메인
export type Domain =
  | "핀테크"
  | "이커머스"
  | "헬스케어"
  | "교육"
  | "엔터테인먼트"
  | "SaaS"
  | "게임"
  | "기타";

// 기업 규모
export type CompanySize = "스타트업" | "중견" | "대기업";

// 지원 현황
export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  domain: Domain;
  companySize: CompanySize;
  techStack: string[];
  stage: Stage;
  appliedAt: string;
  deadline?: string;
  url?: string;
  memo?: string;
  createdAt: string;
}

// 면접 질문
export interface InterviewQuestion {
  id: string;
  applicationId: string;
  question: string;
  myAnswer: string;
  aiFeedback?: string;
  createdAt: string;
}

// AI 분석 결과
export interface AIAnalysisResult {
  summary: string;
  passPatterns: {
    domains: string[];
    companySize: string[];
    techStack: string[];
  };
  failPatterns: {
    domains: string[];
    commonFactors: string[];
  };
  direction: "전문화" | "다양화" | "분석불가";
  directionGuide: string;
  recommendations: string[];
}

export interface AIAnalysis {
  id: string;
  userId: string;
  analysisResult: AIAnalysisResult;
  createdAt: string;
}

// 통계용 타입
export interface StageStats {
  stage: Stage;
  count: number;
  conversionRate?: number;
}

export interface DomainStats {
  domain: Domain;
  total: number;
  passed: number;
  passRate: number;
}

// DB row 타입 (snake_case)
export interface ApplicationRow {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  domain: Domain;
  company_size: CompanySize;
  tech_stack: string[];
  stage: Stage;
  applied_at: string;
  deadline?: string;
  url?: string;
  memo?: string;
  created_at: string;
}

export interface InterviewQuestionRow {
  id: string;
  application_id: string;
  question: string;
  my_answer: string;
  ai_feedback?: string;
  created_at: string;
}
