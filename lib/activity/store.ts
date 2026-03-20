import { UserEvent } from "./types";

const globalForEvents = globalThis as unknown as {
  events: UserEvent[];
};

export const events =
  globalForEvents.events ?? (globalForEvents.events = []);

// export const events = [
//   { userId: "userA", type: "login", timestamp: Date.now() },
//   { userId: "userA", type: "click", timestamp: Date.now() },

//   { userId: "userB", type: "login", timestamp: Date.now() - 1000 * 60 * 30 },

//   { userId: "userC", type: "login", timestamp: Date.now() - 1000 * 60 * 60 * 24 },

//   { userId: "userD", type: "click", timestamp: Date.now() },

//   { userId: "userE", type: "click", timestamp: Date.now() },
//   { userId: "userE", type: "click", timestamp: Date.now() },
//   { userId: "userE", type: "login", timestamp: Date.now() },
// ];