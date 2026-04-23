"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { JobStage, STATUS_TEXT } from "@/types/jog-log/job";
import styles from "../../app/(projects)/job-log/styles/jobLog.module.css";

interface JobFormProps {
  userId: string | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

export default function JobForm({ userId, onSuccess, onClose }: JobFormProps) {
  const supabase = createClient();
  
  // 💡 기존 isOpen 상태를 제거하고 부모의 제어를 따릅니다.
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
    if (!userId) return alert("로그인이 필요합니다.");

    const { error } = await supabase.from("applications").insert([{
      ...formData,
      user_id: userId,
    }]);

    if (error) {
      alert("등록 실패: " + error.message);
    } else {
      // 💡 성공 시 부모의 onSuccess 호출 (성공 로직은 부모가 처리)
      onSuccess();
    }
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
              disabled={isAnalyzing} // 분석 중에는 수정 방지
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
        {/* <div className={styles.formBtns}>
          <button type="submit" className={styles.submitBtn}>등록하기</button>
          <button type="button" onClick={() => setIsOpen(false)} className={styles.cancelBtn}>취소</button>
        </div> */}
        <div className={styles.formBtns}>
          <button type="submit" className={styles.submitBtn} disabled={isAnalyzing}>
            {isAnalyzing ? "분석 중..." : "등록하기"}
          </button>
          {/* 💡 취소 버튼 클릭 시 부모의 onClose 호출 */}
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}