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
  
  // 아코디언 상태 관리를 위한 state
  const [openStrategyIdx, setOpenStrategyIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      
      const isGuest = document.cookie.includes("guest=true") || id.startsWith("guest-");
      setIsGuestMode(isGuest);

      if (isGuest) {
        const localJobs = guestStorage.getJobs();
        const foundInLocal = localJobs.find((item: any) => String(item.id) === id);
        
        if (foundInLocal) {
          setJob(foundInLocal);
        } else {
          const foundInDummy = dummyData.find((item) => String(item.id) === id);
          setJob(foundInDummy || null);
        }
      } else {
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

  const handleCheckChange = (stepId: number, isDone: boolean) => {
    if (!job) return;
    setJob(prev => {
      if (!prev || !prev.ai_guide) return prev;
      return {
        ...prev,
        ai_guide: {
          ...prev.ai_guide,
          checkpoints: prev.ai_guide.checkpoints.map(cp => 
            cp.id === stepId ? { ...cp, done: isDone } : cp
          )
        }
      };
    });
    if (isGuestMode) {
      guestStorage.updateAiStep(job.id, stepId, isDone);
    }
  };

  if (loading) return <div className={styles.wrap}><p>불러오는 중...</p></div>;
  if (!job) return notFound();

  const statusClass = STATUS_CLASS_MAP[job.stage as keyof typeof STATUS_CLASS_MAP] || "applied";

  return (
    <div className={styles.wrap}>
      <header className={styles.apptop}>
        <h1>{job.company_name}</h1>
      </header>

      <main className={styles.contents}>
        {isGuestMode && (
          <div className={styles.guestBanner}>
            ℹ️ 게스트 모드에서는 상세 수정 및 면접 기록 추가가 제한됩니다.
          </div>
        )}

        {/* 1. 기본 정보 카드 */}
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

        {job.ai_guide ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 2. 체크리스트 및 예상 질문 */}
            <div className={styles.formCard}>
              <h3 style={{ marginBottom: "20px" }}>✨ AI 면접 가이드</h3>
              
              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "12px" }}>✅ 면접 전 체크리스트</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {job.ai_guide.checkpoints.map((cp: any) => (
                    <label key={cp.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
                      <input type="checkbox" checked={cp.done} onChange={(e) => handleCheckChange(cp.id, e.target.checked)} />
                      <span>{cp.task}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: "#eff6ff", padding: "16px", borderRadius: "8px", borderLeft: "4px solid #3b82f6" }}>
                <p style={{ color: "#1e40af", fontSize: "13px" }}><strong>💡 AI Tip:</strong> {job.ai_guide.tip}</p>
              </div>
            </div>

            {/* 3. 상황별 답변 전략 (아코디언 섹션) */}
            <div className={styles.formCard}>
              <h3 style={{ marginBottom: "20px" }}>🎯 상황별 실전 전략</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {job.ai_guide.strategies?.map((strategy: any, idx: number) => (
                  <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                    <button
                      onClick={() => setOpenStrategyIdx(openStrategyIdx === idx ? null : idx)}
                      style={{
                        width: "100%", padding: "16px", textAlign: "left", display: "flex", justifyContent: "space-between",
                        alignItems: "center", backgroundColor: openStrategyIdx === idx ? "#f1f5f9" : "#fff", border: "none", cursor: "pointer"
                      }}
                    >
                      <span style={{ fontWeight: "600", color: "#334155", fontSize: "15px" }}>
                        <span style={{ color: "#3b82f6", marginRight: "8px" }}>Q.</span>
                        {strategy.question}
                      </span>
                      <span style={{ color: "#94a3b8" }}>{openStrategyIdx === idx ? "▲" : "▼"}</span>
                    </button>

                    {openStrategyIdx === idx && (
                      <div style={{ padding: "20px", backgroundColor: "#fff", borderTop: "1px solid #e2e8f0" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>질문 의도</p>
                          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>{strategy.intent}</p>
                        </div>
                        <div style={{ padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "8px" }}>
                          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#166534", textTransform: "uppercase", marginBottom: "6px" }}>추천 답변 방향</p>
                          <p style={{ fontSize: "14px", color: "#166534", lineHeight: "1.6" }}>{strategy.best_answer_tip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.formCard} style={{ textAlign: "center", color: "#94a3b8" }}>
            <p>이 공고에 대한 AI 분석 정보가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}