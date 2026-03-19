import { UserEvent, EventType } from "@/lib/activity/types";

const EVENT_WEIGHT: Record<EventType, number> = {
  click: 1,
  login: 3,
};

const LAMBDA = 0.0001;

export function calculateScore(events: UserEvent[]): number {
  const now = Date.now();

  return events.reduce((total, event) => {
    const timeDiff = now - event.timestamp;

    const decay = Math.exp(-LAMBDA * timeDiff);

    const weight = EVENT_WEIGHT[event.type] ?? 1;

    return total + weight * decay;
  }, 0);
}