import { Event } from "./types";

export function calculateUserStatus(events: Event[]) {
  const now = Date.now();

  const userMap: Record<string, Event[]> = {};

  // 유저별 이벤트 묶기
  events.forEach((event) => {
    if (!userMap[event.userId]) {
      userMap[event.userId] = [];
    }
    userMap[event.userId].push(event);
  });

  return Object.keys(userMap).map((userId) => {
    const sorted = userMap[userId].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    const lastEvent = sorted[0];
    const diff = (now - lastEvent.timestamp) / 1000 / 60;

    let status = "Churn";

    if (diff <= 5) status = "Active";
    else if (diff <= 10) status = "Idle";

    return {
      userId,
      status,
      lastActive: Math.floor(diff), // 몇 분 전
    };
  });
}