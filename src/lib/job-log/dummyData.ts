import { Job } from "@/types/jog-log/job";

export const dummyData: Job[] = [
  {
    id: "1",
    company_name: "Google",
    job_title: "Frontend Developer",
    domain: "www.google.com",
    company_size: "대기업",
    stage: "서류",
    applied_at: "2024-03-01",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
  },
  {
    id: "2",
    company_name: "Netflix",
    job_title: "React Engineer",
    domain: "www.netflix.com",
    company_size: "대기업",
    stage: "불합격",
    applied_at: "2024-03-05",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
  },
  {
    id: "3",
    company_name: "Amazon",
    job_title: "Software Engineer",
    domain: "www.amazon.com",
    company_size: "대기업",
    stage: "합격",
    applied_at: "2024-03-10",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
  },
  {
    id: "4",
    company_name: "토스",
    job_title: "Frontend Developer",
    domain: "www.toss.im",
    company_size: "유니콘",
    stage: "면접",
    applied_at: "2024-03-15",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
  }
];