import { UserEvent } from "@/lib/activity/types";

export function groupEventsByUser(events: UserEvent[]) {
  const userMap: Record<string, UserEvent[]> = {};

  events.forEach((event) => {
    if (!userMap[event.userId]) {
      userMap[event.userId] = [];
    }

    userMap[event.userId].push(event);
  });

  return Object.keys(userMap).map((userId) => ({
    userId,
    events: userMap[userId],
  }));
}