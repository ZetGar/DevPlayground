// domain/userMapper.ts
import { ApiUser } from "@/lib/activity/types";
import { User } from "./user";
import { getUserStatus } from "./userStatus";
import { getRecommendation } from "./recommendation";

export function toUser(apiUser: ApiUser): User {
  const events = apiUser.events;
  const last = events[events.length - 1];

  return {
    userId: apiUser.userId,
    lastActive: last?.timestamp ?? 0,
    status: getUserStatus(events),
    recommendation: getRecommendation(events),    
  };
}