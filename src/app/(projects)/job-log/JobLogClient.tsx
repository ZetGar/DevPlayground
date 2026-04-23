"use client";

import styles from "./styles/jobLog.module.css";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { dummyData } from "./../../../lib/job-log/dummyData";
import { Job, JobLogClientProps, STATUS_CLASS_MAP } from "@/types/jog-log/job";
import { guestStorage } from "../../../lib/job-log/domain/guestStorage";
import JobForm from "@/components/job-log/JobForm";
import Link from "next/link";

export default function JobLogClient({ user, isGuest }: JobLogClientProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. 공통 확인창
    const isGuestData = jobId.toString().startsWith("guest-");
    const message = isGuestData 
      ? "체험 데이터를 삭제하시겠습니까?" 
      : "실제 지원 내역을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)";

    if (!confirm(message)) return;

    try {
      if (isGuestData) {
        // 💡 게스트 모드: 로컬 스토리지에서 삭제
        guestStorage.deleteJob(jobId);
      } else {
        // 💡 로그인 모드: Supabase DB에서 삭제
        const { error } = await supabase
          .from("applications")
          .delete()
          .eq("id", jobId);

        if (error) throw error;
      }

      // 목록 새로고침
      fetchJobs();
    } catch (error: any) {
      alert("삭제 중 오류가 발생했습니다: " + error.message);
    }
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
  
    if (isGuest) {
      const guestJobs = guestStorage.getJobs(); 
      
      setJobs([...guestJobs, ...dummyData]);
      setLoading(false);
      return;
    }

    if (user) {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("applied_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error.message);
      } else {
        setJobs(data as Job[]);
      }
    }
    setLoading(false);
  }, [isGuest, user, supabase]);

  // 게스트 등록 성공 시 콜백
  const handleGuestSuccess = () => {
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "guest=; path=/; max-age=0";
    router.push("/login");
  };

  const handleOpenForm = () => {
    // if (isGuest) {
    //   if (confirm("새 지원 내역 등록은 로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?")) {
    //     router.push("/login"); 
    //   }
    //   return;
    // }
    setShowForm(true); // ✅ 함수 호출 확인
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.apptop}>
        <div>
          <h1>Job Log</h1>
          <div className={styles.topBtns}>
            {!isGuest && <button onClick={handleLogout} className={styles.logoutBtn}>로그아웃</button>}
          </div>
        </div>
      </div>

      <div className={styles.contents}>
        {isGuest && (
          <div className={styles.guestBanner}>
            <span>ℹ️ 현재 게스트 모드입니다. 작성하신 내용은 브라우저에 임시 저장되며, 로그인 시 안전하게 보관됩니다.</span>
          </div>
        )}

        <button 
          className={`${styles.addBtn} ${isGuest ? styles.addBtnGuest : ""}`} 
          onClick={handleOpenForm}
        >
          {/* 💡 게스트일 때 문구를 더 매력적으로 변경 */}
          + {isGuest ? "새 지원 내역 등록 체험 (AI 분석)" : "새 지원 내역 등록"}
        </button>

        {/* ✅ JobForm 렌더링 영역 */}
        {showForm && (
          <JobForm 
            userId={user?.id}
            onClose={() => setShowForm(false)} 
            onSuccess={() => {
              fetchJobs();
              setShowForm(false);
            }}
          />
        )}

        {loading ? (
          <p className={styles.loading}>데이터를 불러오는 중...</p>
        ) : jobs.length > 0 ? (
          <div className={styles.jobList}>
            {jobs.map((job) => {
              const statusClass = STATUS_CLASS_MAP[job.stage] || 'applied';
              const isGuestData = job.id.toString().startsWith('guest-');

              return (
                <Link href={`/job-log/interview/${job.id}`} key={job.id}>
                  <div className={styles.card}>
                    <div className={styles.cardTop}>
                      <div className={styles.titleArea}>
                        <strong>{job.company_name}</strong>
                        {isGuestData && <span className={styles.guestBadge}>(체험 데이터)</span>}
                      </div>
                      
                      <div className={styles.actionArea}>

                        <button 
                          onClick={(e) => handleDelete(job.id, e)}
                          className={styles.deleteBtn}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className={styles.cardBottom}>
                      <span>{job.job_title}</span>
                      <div>
                        <span>{job.applied_at}</span> ·
                        <span className={styles[statusClass]}>{job.stage}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>등록된 지원 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}