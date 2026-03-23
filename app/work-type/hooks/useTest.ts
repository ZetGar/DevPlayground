"use client";

import { useState } from "react";
import { questions } from "../data/questions";
import { workTypes, WorkType } from "../data/types";
import { calculateWorkType } from "../utils/calculator";

export function useTest() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<WorkType | null>(null);

  const total = questions.length;
  const currentQuestion = questions[currentQ];
  const isFinished = result !== null;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQ < total - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // 12개 다 답하면 결과 계산
      const code = calculateWorkType(newAnswers);
      setResult(workTypes[code]);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  return {
    currentQ,
    total,
    currentQuestion,
    result,
    isFinished,
    handleAnswer,
    reset,
  };
}