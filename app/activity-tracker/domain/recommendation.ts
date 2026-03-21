import { UserEvent } from "@/lib/activity/types";
import { calculateScore } from "./userScore";

export type Recommendation = {
  message: string;
  reason: string;
};

export function getRecommendation(events: UserEvent[]) {
  const score = calculateScore(events);

  const now = Date.now();
  const lastEvent = events[events.length - 1];
  const minutes = lastEvent
    ? (now - lastEvent.timestamp) / 1000 / 60
    : Infinity;

  // 🔥 매우 활발 + 최근 활동 있음
  if (score > 1.5 && minutes < 5) {
    return {
      message: "🔥 프리미엄 기능 추천",
      reason: "최근 활동이 매우 활발한 사용자입니다",
    };
  }

  // 🙂 적당히 활동하지만 약간 뜸함
  if (score > 0.3 && minutes < 30) {
    return {
      message: "🙂 추가 기능 사용 유도",
      reason: "간헐적으로 활동하는 사용자입니다",
    };
  }

  // ⚠️ 오래 안 들어옴
  if (minutes >= 30) {
    return {
      message: "⚠️ 리텐션 알림 필요",
      reason: "최근 활동이 거의 없는 사용자입니다",
    };
  }

  // fallback
  return {
    message: "🙂 일반 사용자",
    reason: "평균적인 활동 패턴입니다",
  };
}