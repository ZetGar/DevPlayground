import { UserStatus } from "@/lib/activity/types";

export type ConditionField = "status" | "score" | "lastActiveDaysAgo";
export type ConditionOperator = "==" | ">" | "<" | ">=" | "<=";

export type SegmentCondition = {
  field: ConditionField;
  operator: ConditionOperator;
  value: UserStatus | number;
};

export type Segment = {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  createdAt: number;
};

export type TriggerType =
  | "status_change"      // 상태가 변경될 때
  | "inactive_3days"     // 3일 이상 비활동
  | "score_below";       // score가 기준 이하로 떨어질 때

export type ActionType =
  | "send_message"       // 메시지 생성
  | "send_notification"  // 알림 전송 (mock)
  | "send_email";        // 이메일 전송 (mock)

export type Campaign = {
  id: string;
  name: string;
  segmentId: string;
  triggerType: TriggerType;
  actionType: ActionType;
  actionPayload: {
    message: string;
  };
  createdAt: number;
  isActive: boolean;
};

export type ExecutionResult = "success" | "failed" | "skipped";

export type ExecutionLog = {
  id: string;
  userId: string;
  campaignId: string;
  executedAt: number;
  result: ExecutionResult;
  beforeStatus: UserStatus;
  afterStatus?: UserStatus; 
};

export type CreateSegmentRequest = Omit<Segment, "id" | "createdAt">;
export type CreateCampaignRequest = Omit<Campaign, "id" | "createdAt">;