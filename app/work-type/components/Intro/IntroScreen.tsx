"use client";

import styles from "./IntroScreen.module.css";

type Props = {
  onStart: () => void;
};

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className={styles.intro}>
      <div className={styles.badge}>일하는 방식 유형 테스트</div>
      <h1 className={styles.title}>
        나는 어떻게<br />일하는가?
      </h1>
      <p className={styles.desc}>
        3가지 축, 12개 질문으로<br />
        나의 일하는 방식 유형을 알아보세요.
      </p>
      <div className={styles.meta}>
        <span>⏱ 약 3분</span>
        <span className={styles.dot}>·</span>
        <span>📋 12문항</span>
        <span className={styles.dot}>·</span>
        <span>🎯 8가지 유형</span>
      </div>
      <button className={styles.startBtn} onClick={onStart}>
        테스트 시작하기 →
      </button>
    </div>
  );
}
