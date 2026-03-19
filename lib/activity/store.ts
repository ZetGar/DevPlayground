import { UserEvent } from "./types";

const globalForEvents = globalThis as unknown as {
  events: UserEvent[];
};

export const events =
  globalForEvents.events ?? (globalForEvents.events = []);