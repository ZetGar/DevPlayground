"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles/workType.module.css";
import { useTest } from "./hooks/useTest";
import IntroScreen from "./components/Intro/IntroScreen";
import QuestionScreen from "./components/Question/QuestionScreen";
import ResultScreen from "./components/Result/ResultScreen";
import { workTypes, WorkTypeCode } from "./data/types";

type Screen = "intro" | "question" | "result";

export default function WorkTypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultParam = searchParams.get("result") as WorkTypeCode | null;

  // URL에 result 파라미터 있으면 바로 결과 화면
  const [screen, setScreen] = useState<Screen>(
    resultParam && workTypes[resultParam] ? "result" : "intro"
  );

  const { currentQ, total, currentQuestion, result, handleAnswer, reset } = useTest();

  // URL 파라미터로 넘어온 결과
  const sharedResult =
    resultParam && workTypes[resultParam] ? workTypes[resultParam] : null;

  // 최종 결과 (직접 테스트한 결과 or 공유 링크로 넘어온 결과)
  const finalResult = result ?? sharedResult;

  const handleNext = (score: number) => {
    handleAnswer(score);
    if (currentQ === total - 1) {
      setScreen("result");
    }
  };

  // 결과 나오면 URL에 코드 추가
  useEffect(() => {
    if (result) {
      router.replace(`?result=${result.code}`, { scroll: false });
    }
  }, [result, router]);

  const handleRetry = () => {
    reset();
    router.replace("/work-type", { scroll: false });
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
      {screen === "result" && finalResult && (
        <ResultScreen result={finalResult} onRetry={handleRetry} />
      )}
    </div>
  );
}
