import { Application, ApplicationRow, InterviewQuestion, InterviewQuestionRow } from "../types";

export function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    jobTitle: row.job_title,
    domain: row.domain,
    companySize: row.company_size,
    techStack: row.tech_stack,
    stage: row.stage,
    appliedAt: row.applied_at,
    deadline: row.deadline,
    url: row.url,
    memo: row.memo,
    createdAt: row.created_at,
  };
}

export function toApplicationRow(app: Omit<Application, "id" | "createdAt">): Omit<ApplicationRow, "id" | "created_at"> {
  return {
    user_id: app.userId,
    company_name: app.companyName,
    job_title: app.jobTitle,
    domain: app.domain,
    company_size: app.companySize,
    tech_stack: app.techStack,
    stage: app.stage,
    applied_at: app.appliedAt,
    deadline: app.deadline,
    url: app.url,
    memo: app.memo,
  };
}

export function toInterviewQuestion(row: InterviewQuestionRow): InterviewQuestion {
  return {
    id: row.id,
    applicationId: row.application_id,
    question: row.question,
    myAnswer: row.my_answer,
    aiFeedback: row.ai_feedback,
    createdAt: row.created_at,
  };
}
