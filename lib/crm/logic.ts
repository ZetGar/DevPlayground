import { segments } from "./store";
import { UserStatus, UserEvent } from "@/lib/activity/types";
import { calculateScore } from "@/app/activity-tracker/domain/userScore";

type UserContext = {
  userId: string;
  status: UserStatus;
  events: UserEvent[];
};

// 세그먼트 조건이 유저에게 맞는지 평가
export function evaluateSegment(segmentId: string, user: UserContext): boolean {
  const segment = segments.find((s) => s.id === segmentId);
  if (!segment) return false;

  const score = calculateScore(user.events);
  const now = Date.now();
  const lastActive = user.events[user.events.length - 1]?.timestamp ?? 0;
  const lastActiveDaysAgo = (now - lastActive) / (1000 * 60 * 60 * 24);

  return segment.conditions.every((condition) => {
    const { field, operator, value } = condition;

    let actual: string | number;

    if (field === "status") actual = user.status;
    else if (field === "score") actual = score;
    else actual = lastActiveDaysAgo;

    switch (operator) {
      case "==": return actual == value;
      case ">":  return actual > value;
      case "<":  return actual < value;
      case ">=": return actual >= value;
      case "<=": return actual <= value;
      default:   return false;
    }
  });
}