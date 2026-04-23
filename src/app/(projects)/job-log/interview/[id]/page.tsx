// src/app/(projects)/job-log/interview/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { dummyData } from "@/lib/job-log/dummyData";
import { cookies } from "next/headers";
import styles from "../../styles/jobLog.module.css";
import { Job, STATUS_CLASS_MAP } from "@/types/jog-log/job";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailPage({ params }: Props) {
  // 1. 비동기 파라미터와 쿠키를 처리
  const { id } = await params;
  const cookieStore = await cookies();
  const isGuest = cookieStore.get("guest")?.value === "true";

  let job: Job | undefined;

  if (isGuest) {
    // 2. 게스트 모드: 더미 데이터에서 검색
    job = dummyData.find((item) => String(item.id) === id);
  } else {
    // 3. 로그인 모드: Supabase 서버 클라이언트를 생성하여 조회
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      job = data as Job;
    }
  }

  // 데이터가 없는 경우 404 페이지 반환
  if (!job) return notFound();

  const statusClass = STATUS_CLASS_MAP[job.stage as keyof typeof STATUS_CLASS_MAP] || "applied";

  return (
    <div className={styles.wrap}>
      <header className={styles.apptop}>
        <div>
          <h1>{job.company_name}</h1>
          <div/>
        </div>
      </header>

      <main className={styles.contents}>

        {/* 게스트 안내 배너 (상세 페이지용) */}
        {isGuest && (
          <div className={styles.guestBanner} style={{
            backgroundColor: '#f1f5f9',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#475569',
            border: '1px solid #e2e8f0'
          }}>
            ℹ️ 게스트 모드에서는 상세 수정 및 면접 기록 추가가 제한됩니다.
          </div>
        )}


        <div className={styles.card} style={{ cursor: "default", marginBottom: "24px" }}>
          <div className={styles.cardTop}>
            <strong style={{ fontSize: "20px" }}>{job.job_title}</strong>
            <span className={styles[statusClass]}>{job.stage}</span>
          </div>
          <div className={styles.cardBottom} style={{ marginTop: "12px" }}>
            <span>도메인: {job.domain}</span>
            <span>지원일: {job.applied_at}</span>
          </div>
        </div>

        {/* 면접 질문 섹션 */}
        <div className={styles.formCard}>
          <h3 style={{ marginBottom: "16px" }}>면접 질문 및 답변</h3>
          <p style={{ color: "#64748b" }}>
            여기에 질문 리스트와 AI 분석 기능을 추가할 예정입니다.
          </p>
        </div>
      </main>
    </div>
  );
}