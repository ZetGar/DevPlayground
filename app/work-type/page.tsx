"use client";

import { useState } from "react";
import styles from "./styles/workType.module.css";
import { useTest } from "./hooks/useTest";
import IntroScreen from "./components/Intro/IntroScreen";
import QuestionScreen from "./components/Question/QuestionScreen";
import ResultScreen from "./components/Result/ResultScreen";

type Screen = "intro" | "question" | "result";

export default function WorkTypePage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const { currentQ, total, currentQuestion, result, handleAnswer, reset } = useTest();

  const handleNext = (score: number) => {
    handleAnswer(score);
    // 마지막 질문이면 result 화면으로
    if (currentQ === total - 1) {
      setScreen("result");
    }
  };

  const handleRetry = () => {
    reset();
    setScreen("intro");
  };

  return (
    <div className={styles.page}>
      {screen === "intro" && (
        <IntroScreen onStart={() => setScreen("question")} />
      )}
      {screen === "question" && (
        <QuestionScreen
          question={currentQuestion}
          current={currentQ}
          total={total}
          onNext={handleNext}
        />
      )}
      {screen === "result" && result && (
        <ResultScreen result={result} onRetry={handleRetry} />
      )}
    </div>
  );
}
