"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { dummyData } from "@/lib/job-log/dummyData";
import { guestStorage } from "./../../../../../lib/job-log/domain/guestStorage";
import { createClient } from "@/lib/supabase/client";
import styles from "../../styles/jobLog.module.css";
import { Job, STATUS_CLASS_MAP } from "@/types/jog-log/job";

interface Props {
  params: Promise<{ id: string }>;
}

export default function InterviewDetailPage({ params }: Props) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      
      // 1. 쿠키 확인을 통해 게스트 여부 판단
      const isGuest = document.cookie.includes("guest=true");
      setIsGuestMode(isGuest);

      if (isGuest) {
        // 💡 게스트 모드: 로컬 스토리지 먼저 확인 -> 없으면 더미 데이터
        const localJobs = guestStorage.getJobs();
        const foundInLocal = localJobs.find((item: any) => String(item.id) === id);
        
        if (foundInLocal) {
          setJob(foundInLocal);
        } else {
          const foundInDummy = dummyData.find((item) => String(item.id) === id);
          setJob(foundInDummy || null);
        }
      } else {
        // 💡 로그인 모드: Supabase 조회
        const supabase = createClient();
        const { data } = await supabase
          .from("applications")
          .select("*")
          .eq("id", id)
          .single();
        
        if (data) setJob(data as Job);
      }
      setLoading(false);
    };

    fetchJobDetail();
  }, [id]);

  if (loading) return <div className={styles.wrap}><p>불러오는 중...</p></div>;
  if (!job) return notFound();

  const statusClass = STATUS_CLASS_MAP[job.stage as keyof typeof STATUS_CLASS_MAP] || "applied";

  return (
    <div className={styles.wrap}>
      <header className={styles.apptop}>
        <div>
          <h1>{job.company_name}</h1>
        </div>
      </header>

      <main className={styles.contents}>
        {isGuestMode && (
          <div className={styles.guestBanner}>
            ℹ️ 게스트 모드에서는 상세 수정 및 면접 기록 추가가 제한됩니다.
          </div>
        )}

        <div className={styles.card} style={{ cursor: "default", marginBottom: "24px" }}>
          <div className={styles.cardTop}>
            <strong style={{ fontSize: "20px" }}>{job.job_title}</strong>
            <span className={styles[statusClass]}>{job.stage}</span>
          </div>
          <div className={styles.cardBottom} style={{ marginTop: "12px" }}>
            <span>도메인: {job.domain || "미지정"}</span>
            <span>지원일: {job.applied_at}</span>
          </div>
        </div>

        {/* AI 분석 결과 섹션 */}
        <div className={styles.formCard}>
          <h3 style={{ marginBottom: "16px" }}>✨ AI 면접 가이드</h3>
          <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #3b82f6" }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>추천 준비 사항:</p>
            <ul style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
              <li>{job.company_name}의 최근 비즈니스 모델과 {job.domain} 시장 점유율 분석</li>
              <li>{job.job_title} 직무 핵심 역량인 기술 스택 기반 프로젝트 복기</li>
              <li>공고 내용을 바탕으로 한 '성장 가능성' 중심의 1분 자기소개 준비</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}