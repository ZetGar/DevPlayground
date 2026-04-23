"use client";

import styles from "./styles/jobLog.module.css";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { dummyData } from "./../../../lib/job-log/dummyData";
import { Job, JobLogClientProps, STATUS_CLASS_MAP } from "@/types/jog-log/job";
import JobForm from "@/components/job-log/JobForm";
import Link from "next/link";

export default function JobLogClient({ user, isGuest }: JobLogClientProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false); // ✅ 상태 확인
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setJobs(dummyData);
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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "guest=; path=/; max-age=0";
    router.push("/login");
  };

  const handleOpenForm = () => {
    if (isGuest) {
      if (confirm("새 지원 내역 등록은 로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?")) {
        router.push("/login"); 
      }
      return;
    }
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
            <span>ℹ️ 현재 게스트 모드입니다. 등록 기능은 로그인 후 이용 가능합니다.</span>
          </div>
        )}

        <button 
          className={`${styles.addBtn} ${isGuest ? styles.addBtnGuest : ""}`} 
          onClick={handleOpenForm}
        >
          + 새 지원 내역 등록 {isGuest ? "(로그인 필요)" : ""}
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
              return (
                <Link href={`/job-log/interview/${job.id}`} key={job.id}>
                  <div className={styles.card}>
                    <div className={styles.cardTop}>
                      <strong>{job.company_name}</strong>
                      <span className={styles[statusClass]}>{job.stage}</span>
                    </div>
                    <div className={styles.cardBottom}>
                      <span>{job.job_title}</span>
                      <span>{job.applied_at}</span>
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