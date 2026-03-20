import { UserEvent } from "@/lib/activity/types";
import { calculateScore } from "./userScore";

export type Recommendation = {
  message: string;
  reason: string;
};

export function getRecommendation(events: UserEvent[]) {
  const score = calculateScore(events);

  if (score > 1.5) {
    return {
      message: "🔥 프리미엄 기능 추천",
      reason: "최근 활동이 매우 활발한 사용자입니다",
    };
  }

  if (score > 0.3) {
    return {
      message: "🙂 추가 기능 사용 유도",
      reason: "간헐적으로 활동하는 사용자입니다",
    };
  }

  return {
    message: "⚠️ 리텐션 알림 필요",
    reason: "최근 활동이 거의 없는 사용자입니다",
  };
}