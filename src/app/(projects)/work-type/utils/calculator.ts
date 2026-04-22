import { WorkTypeCode } from "../data/types";

// 12개 답변 score 배열 → 유형 코드 계산
export function calculateWorkType(answers: number[]): WorkTypeCode {
  // 축별 점수 합산
  const scoreA = answers[0] + answers[1] + answers[2] + answers[3]; // Q1~4
  const scoreB = answers[4] + answers[5] + answers[6] + answers[7]; // Q5~8
  const scoreC = answers[8] + answers[9] + answers[10] + answers[11]; // Q9~12

  // 축별 방향 결정 (총점 > 4 이면 P/S/Q, ≤ 4 이면 I/T/D)
  const axisA = scoreA > 4 ? "P" : "I";
  const axisB = scoreB > 4 ? "S" : "T";
  const axisC = scoreC > 4 ? "Q" : "D";

  return `${axisA}${axisB}${axisC}` as WorkTypeCode;
}