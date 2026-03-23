"use client";

import { useState } from "react";
import styles from "./styles/workType.module.css";

// 임시 타입 (나중에 data/ 폴더로 분리)
type Screen = "intro" | "question" | "result";

export default function WorkTypePage() {
    const [screen, setScreen] = useState<Screen>("intro");
    const [currentQ, setCurrentQ] = useState(0); // 0~11
    const totalQuestions = 12;

    return (
        <div className={styles.page}>
            {screen === "intro" && (
                <IntroScreen onStart={() => setScreen("question")} />
            )}
            {screen === "question" && (
                <QuestionScreen
                    current={currentQ}
                    total={totalQuestions}
                    onNext={() => {
                        if (currentQ < totalQuestions - 1) {
                            setCurrentQ((prev) => prev + 1);
                        } else {
                            setScreen("result");
                        }
                    }}
                />
            )}
            {screen === "result" && (
                <ResultScreen onRetry={() => { setScreen("intro"); setCurrentQ(0); }} />
            )}
        </div>
    );
}

// ── 인트로 ──────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
    return (
        <div className={styles.intro}>
            <div className={styles.introBadge}>일하는 방식 유형 테스트</div>
            <h1 className={styles.introTitle}>
                나는 어떻게<br />일하는가?
            </h1>
            <p className={styles.introDesc}>
                3가지 축, 12개 질문으로<br />
                나의 일하는 방식 유형을 알아보세요.
            </p>
            <div className={styles.introMeta}>
                <span>⏱ 약 3분</span>
                <span>·</span>
                <span>📋 12문항</span>
                <span>·</span>
                <span>🎯 8가지 유형</span>
            </div>
            <button className={styles.startBtn} onClick={onStart}>
                테스트 시작하기 →
            </button>
        </div>
    );
}

// ── 질문 ──────────────────────────────────────
function QuestionScreen({
    current,
    total,
    onNext,
}: {
    current: number;
    total: number;
    onNext: () => void;
}) {
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (index: number) => {
        setSelected(index);
        setTimeout(() => {
            setSelected(null);
            onNext();
        }, 400);
    };

    const progress = ((current + 1) / total) * 100;

    // 임시 질문 (나중에 questions.ts에서 import)
    const question = {
        text: "새 프로젝트/업무 시작 전 나는?",
        options: [
            "전체 흐름을 먼저 정리하고 시작한다",
            "일단 시작하면서 방향을 잡는다",
            "대략적인 방향만 잡고 시작한다",
            "시작하는 게 곧 계획이다",
        ],
    };

    return (
        <div className={styles.questionWrapper}>
            {/* 진행 바 */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className={styles.progressText}>
                {current + 1} / {total}
            </p>

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
                        onClick={() => handleSelect(i)}
                    >
                        <span className={styles.optionLabel}>
                            {["A", "B", "C", "D"][i]}
                        </span>
                        <span className={styles.optionText}>{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── 결과 ──────────────────────────────────────
function ResultScreen({ onRetry }: { onRetry: () => void }) {
    // 임시 결과 (나중에 calculator.ts에서 계산)
    const result = {
        code: "PSQ",
        emoji: "🏰",
        name: "전략가",
        summary: "3개월치 계획을 엑셀로 관리합니다",
        strengths: ["체계적인 계획 수립", "혼자서도 높은 집중력", "완성도에 대한 높은 기준"],
        weaknesses: ["갑작스러운 변화에 적응이 느림", "완벽주의로 인한 번아웃 위험"],
        environment: "조용한 환경에서 혼자 집중할 수 있는 공간",
    };

    return (
        <div className={styles.result}>
            <p className={styles.resultLabel}>나의 유형은</p>
            <div className={styles.resultEmoji}>{result.emoji}</div>
            <h2 className={styles.resultName}>{result.name}</h2>
            <p className={styles.resultCode}>{result.code}</p>
            <p className={styles.resultSummary}>"{result.summary}"</p>

            <div className={styles.resultCards}>
                <div className={styles.resultCard}>
                    <p className={styles.resultCardTitle}>💪 강점</p>
                    <ul className={styles.resultList}>
                        {result.strengths.map((s) => (
                            <li key={s}>{s}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.resultCard}>
                    <p className={styles.resultCardTitle}>⚠️ 약점</p>
                    <ul className={styles.resultList}>
                        {result.weaknesses.map((w) => (
                            <li key={w}>{w}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.resultEnv}>
                <p className={styles.resultCardTitle}>🏢 잘 맞는 환경</p>
                <p className={styles.resultEnvText}>{result.environment}</p>
            </div>

            {/* 공유 버튼 */}
            <div className={styles.shareButtons}>
                <button className={styles.shareBtn}>🔗 링크 복사</button>
                <button className={styles.shareBtn}>📷 이미지 저장</button>
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
