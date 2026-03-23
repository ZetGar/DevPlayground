"use client";

import { useState } from "react";
import styles from "./QuestionScreen.module.css";
import { Question } from "../../data/questions";

type Props = {
  question: Question;
  current: number;
  total: number;
  onNext: (score: number) => void;
};

export default function QuestionScreen({ question, current, total, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number, score: number) => {
    setSelected(index);
    setTimeout(() => {
      setSelected(null);
      onNext(score);
    }, 400);
  };

  const progress = ((current + 1) / total) * 100;

  return (
    <div className={styles.wrapper}>
      {/* 진행 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.progressText}>{current + 1} / {total}</p>

      {/* 질문 */}
      <div className={styles.questionBox}>
        <p className={styles.questionNumber}>Q{current + 1}</p>
        <h2 className={styles.questionText}>{question.text}</h2>
      </div>

      {/* 선택지 */}
      <div className={styles.options}>
        {question.options.map((option, i) => (
          <button
            key={i}
            className={`${styles.option} ${selected === i ? styles.optionSelected : ""}`}
            onClick={() => handleSelect(i, option.score)}
          >
            <span className={styles.optionLabel}>
              {["A", "B", "C", "D"][i]}
            </span>
            <span className={styles.optionText}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
