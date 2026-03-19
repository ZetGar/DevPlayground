export type EventType = "click" | "login";

export type UserEvent = {
  userId: string;
  type: EventType;
  timestamp: number;
};

export type UserStatus = "Active" | "Idle" | "Churn";

/* 내부에서 쓰는 타입 */
export type User = {
  userId: string;
  status: UserStatus;
  lastActive: number;
};

/* API에서 오는 원본 타입 */
export type ApiUser = {
  userId: string;
  events: UserEvent[];
};