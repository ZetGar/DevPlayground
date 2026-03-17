export type Event = {
  userId: string;
  type: string;
  timestamp: number;
};

export type User = {
  userId: string;
  status: "Active" | "Idle" | "Churn";
  lastActive: number;
};