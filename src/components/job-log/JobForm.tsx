"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { JobStage, STATUS_TEXT } from "@/types/jog-log/job";
import { guestStorage } from "../../lib/job-log/domain/guestStorage";
import { generateAiGuide } from "../../lib/job-log/domain/analysis"
import styles from "../../app/(projects)/job-log/styles/jobLog.module.css";

interface JobFormProps {
  userId: string | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

export default function JobForm({ userId, onSuccess, onClose }: JobFormProps) {
  const supabase = createClient();
  
  const [showStageDrop, setShowStageDrop] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSizeDrop, setShowSizeDrop] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    domain: "",
    job_url: "",
    company_size: "중소기업", 
    stage: "서류" as JobStage,
    applied_at: new Date().toISOString().split("T")[0],
  });

  const handleUrlChange = async (url: string) => {
    setFormData((prev) => ({ ...prev, job_url: url }));

    if (url.includes("wanted.co.kr") || url.includes("saramin.co.kr")) {
      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/job-log/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.company_name) {
          setFormData((prev) => ({
            ...prev,
            company_name: data.company_name,
            job_title: data.job_title,
            domain: data.domain,
          }));
        }
      } catch (error) {
        console.error("AI 분석 중 오류 발생:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };
  
  const COMPANY_SIZES = ["대기업", "중견기업", "중소기업", "스타트업"];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. 분석 시작 상태 (버튼 비활성화)
  setIsAnalyzing(true);

  // 2. 가이드 생성 (analysis.ts의 로직 호출)
  const aiGuide = generateAiGuide(
    formData.company_name, 
    formData.job_title, 
    formData.domain
  );

  const finalData = {
    ...formData,
    ai_guide: aiGuide,
  };

  // 비회원일 경우 의도적으로 1초 대기 (UX 연출)
  if (!userId) {
    setTimeout(() => {
      const guestJob = {
        ...finalData,
        id: `guest-${Date.now()}`,
        user_id: "guest-user",
        created_at: new Date().toISOString(),
      };
      
      guestStorage.addJob(guestJob);
      setIsAnalyzing(false);
      alert("AI 맞춤 면접 가이드가 생성되었습니다!");
      onSuccess();
    }, 1000);
    return;
  }

  // 로그인 사용자 로직...
  const { error } = await supabase.from("applications").insert([{
    ...finalData,
    user_id: userId,
  }]);
  
  setIsAnalyzing(false);
  if (!error) onSuccess();
};

  useEffect(() => {
    const handleClickOutside = () => {
      setShowStageDrop(false);
      setShowSizeDrop(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.formCard}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>공고 URL {isAnalyzing && <span className={styles.loadingText}>✨ 분석 중...</span>}</label>
            <input 
              type="url" 
              disabled={isAnalyzing}
              placeholder={isAnalyzing ? "AI가 정보를 추출하고 있습니다..." : "링크를 입력하세요 (예: https://www.wanted.co.kr/wd/12345)"}
              value={formData.job_url}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>회사명</label>
            <input 
              type="text" 
              placeholder="예: 구글 코리아" 
              required 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>포지션</label>
            <input 
              type="text" 
              placeholder="예: 프론트엔드 개발자" 
              required 
              value={formData.job_title}
              onChange={(e) => setFormData({...formData, job_title: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>도메인</label>
            <input 
              type="text" 
              placeholder="예: 이커머스, 핀테크" 
              required 
              value={formData.domain}
              onChange={(e) => setFormData({...formData, domain: e.target.value})}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>지원 단계</label>
            <div className={styles.customSelect}
              onClick={(e) => {
                e.stopPropagation();
                setShowStageDrop(!showStageDrop);
              }}
            >
              <div className={styles.selectTrigger}>
                {STATUS_TEXT[formData.stage]}
                <span className={styles.arrow}>{showStageDrop ? "▲" : "▼"}</span>
              </div>
              {showStageDrop && (
                <ul className={styles.options}>
                  {Object.entries(STATUS_TEXT).map(([key, value]) => (
                    <li 
                      key={key} 
                      onClick={() => setFormData({...formData, stage: key as JobStage})}
                      className={formData.stage === key ? styles.selected : ""}
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>기업 규모</label>
            <div 
              className={styles.customSelect} 
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeDrop(!showSizeDrop);
              }}
            >
              <div className={styles.selectTrigger}>
                {formData.company_size}
                <span className={styles.arrow}>{showSizeDrop ? "▲" : "▼"}</span>
              </div>
              
              {showSizeDrop && (
                <ul className={styles.options}>
                  {COMPANY_SIZES.map((size) => (
                    <li 
                      key={size} 
                      onClick={() => setFormData({...formData, company_size: size})}
                      className={formData.company_size === size ? styles.selected : ""}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>지원 날짜</label>
            <input 
              type="date" 
              required 
              value={formData.applied_at}
              onChange={(e) => setFormData({...formData, applied_at: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.formBtns}>
          <button type="submit" className={styles.submitBtn} disabled={isAnalyzing}>
            {isAnalyzing ? "분석 중..." : "등록하기"}
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}