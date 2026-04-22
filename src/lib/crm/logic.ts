import { supabase } from "@/lib/supabase";
import { UserStatus, UserEvent } from "@/lib/activity/types";
import { calculateScore } from "@/lib/activity/domain/userScore";
import { Segment } from "./types";

type UserContext = {
  userId: string;
  status: UserStatus;
  events: UserEvent[];
};

// Supabase에서 세그먼트 가져와서 조건 평가
export async function evaluateSegmentById(
  segmentId: string,
  user: UserContext
): Promise<boolean> {
  const { data, error } = await supabase
    .from("segments")
    .select("*")
    .eq("id", segmentId)
    .single();

  if (error || !data) return false;

  const segment: Segment = {
    id: data.id,
    name: data.name,
    conditions: data.conditions,
    createdAt: data.created_at,
  };

  return evaluateConditions(segment, user);
}

function evaluateConditions(segment: Segment, user: UserContext): boolean {
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