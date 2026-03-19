import { UserEvent } from "@/lib/activity/types";
import { UserStatus } from "./user";
import { calculateScore } from "./userScore";

export function getUserStatus(events: UserEvent[]): UserStatus {
  const score = calculateScore(events);

  if (score > 1) return "Active";
  if (score > 0.2) return "Idle";
  return "Churn";
}