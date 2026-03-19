// domain/user.ts
export type UserStatus = "Active" | "Idle" | "Churn";

export type User = {
  userId: string;
  status: UserStatus;
  lastActive: number;
};