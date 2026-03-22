import { UserEvent } from "./types";

const now = Date.now();
const min = 60 * 1000;

const mockEvents: UserEvent[] = [
  { userId: "user-a", type: "login", timestamp: now - 2 * min },
  { userId: "user-a", type: "purchase", timestamp: now - 1 * min },
  { userId: "user-b", type: "login", timestamp: now - 10 * min },
  { userId: "user-b", type: "click", timestamp: now - 10 * min },
  { userId: "user-c", type: "click", timestamp: now - 60 * min },
  { userId: "user-d", type: "scroll", timestamp: now - 90 * min },
  { userId: "user-e", type: "scroll", timestamp: now - 300 * min },
];

const globalForEvents = globalThis as unknown as {
  events: UserEvent[];
};

export const events =
  globalForEvents.events ?? (globalForEvents.events = [...mockEvents]);