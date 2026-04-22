"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import styles from "./ResultScreen.module.css";
import { WorkType } from "../../data/types";

type Props = {
  result: WorkType;
  onRetry: () => void;
};

export default function ResultScreen({ result, onRetry }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/work-type?result=${result.code}`;
    navigator.clipboard.writeText(url);
    alert("링크가 복사됐어요!");
  };

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: "#fafaf8",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `일잘러테스트_${result.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={styles.result}>
      {/* 이미지 저장 대상 영역 */}
      <div ref={captureRef} className={styles.captureArea}>
        <p className={styles.label}>나의 유형은</p>
        <div className={styles.emoji}>{result.emoji}</div>
        <h2 className={styles.name}>{result.name}</h2>
        <p className={styles.code}>{result.code}</p>
        <p className={styles.summary}>{result.summary}</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>💪 강점</p>
            <ul className={styles.list}>
              {result.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>⚠️ 약점</p>
            <ul className={styles.list}>
              {result.weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.envCard}>
          <p className={styles.cardTitle}>🏢 잘 맞는 환경</p>
          <p className={styles.envText}>{result.environment}</p>
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className={styles.shareButtons}>
        <button className={styles.shareBtn} onClick={handleCopyLink}>
          🔗 링크 복사
        </button>
        <button className={styles.shareBtn} onClick={handleSaveImage}>
          📷 이미지 저장
        </button>
      </div>

      <button className={styles.retryBtn} onClick={onRetry}>
        다시 테스트하기
      </button>
    </div>
  );
}
