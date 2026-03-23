"use client";

import styles from "./ResultScreen.module.css";
import { WorkType } from "../../data/workTypes";

type Props = {
  result: WorkType;
  onRetry: () => void;
};

export default function ResultScreen({ result, onRetry }: Props) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사됐어요!");
  };

  return (
    <div className={styles.result}>
      <p className={styles.label}>나의 유형은</p>
      <div className={styles.emoji}>{result.emoji}</div>
      <h2 className={styles.name}>{result.name}</h2>
      <p className={styles.code}>{result.code}</p>
      <p className={styles.summary}>"{result.summary}"</p>

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

      {/* 공유 버튼 */}
      <div className={styles.shareButtons}>
        <button className={styles.shareBtn} onClick={handleCopyLink}>
          🔗 링크 복사
        </button>
        <button className={styles.shareBtn}>
          📷 이미지 저장
        </button>
        <button className={`${styles.shareBtn} ${styles.kakaoBtn}`}>
          카카오 공유
        </button>
      </div>

      <button className={styles.retryBtn} onClick={onRetry}>
        다시 테스트하기
      </button>
    </div>
  );
}
