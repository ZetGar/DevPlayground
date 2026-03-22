import { UserEvent, EventType } from "@/lib/activity/types";

const EVENT_WEIGHT: Record<EventType, number> = {
  scroll: 0.5,    // 수동적 행동
  click: 1,       // 기본 인터랙션
  search: 2,      // 의도적 탐색
  login: 3,       // 세션 시작
  purchase: 5,    // 가장 강한 활동 신호
};

const LAMBDA = 0.0000005;

export function calculateScore(events: UserEvent[]): number {
  const now = Date.now();

  return events.reduce((total, event) => {
    const timeDiff = now - event.timestamp;

    const decay = Math.exp(-LAMBDA * timeDiff);

    const weight = EVENT_WEIGHT[event.type] ?? 1;

    return total + weight * decay;
  }, 0);
}