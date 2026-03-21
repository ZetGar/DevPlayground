import { User } from "../domain/user";

const now = Date.now();
const min = 60 * 1000;

export const MOCK_USERS: User[] = [
  {
    userId: "user-a",
    status: "Active",
    lastActive: now - 2 * min,
    recommendation: {
      message: "🔥 프리미엄 기능 추천",
      reason: "최근 활동이 매우 활발한 사용자입니다",
    },
  },
  {
    userId: "user-b",
    status: "Active",
    lastActive: now - 10 * min,
    recommendation: {
      message: "🙂 추가 기능 사용 유도",
      reason: "간헐적으로 활동하는 사용자입니다",
    },
  },
  {
    userId: "user-c",
    status: "Idle",
    lastActive: now - 60 * min,
    recommendation: {
      message: "⚠️ 리텐션 알림 필요",
      reason: "최근 활동이 거의 없는 사용자입니다",
    },
  },
  {
    userId: "user-d",
    status: "Idle",
    lastActive: now - 90 * min,
    recommendation: {
      message: "⚠️ 리텐션 알림 필요",
      reason: "최근 활동이 거의 없는 사용자입니다",
    },
  },
  {
    userId: "user-e",
    status: "Churn",
    lastActive: now - 300 * min,
    recommendation: {
      message: "⚠️ 리텐션 알림 필요",
      reason: "최근 활동이 거의 없는 사용자입니다",
    },
  },
];