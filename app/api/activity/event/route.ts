import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/activity/store";
import { executionLogs } from "@/lib/crm/store";
import { getUserStatus } from "@/app/activity-tracker/domain/userStatus";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newEvent = {
    userId: body.userId,
    type: body.type,
    timestamp: Date.now(),
  };

  events.push(newEvent);

  // 이 유저의 최신 이벤트 기반으로 afterStatus 갱신
  const userEvents = events.filter((e) => e.userId === body.userId);
  const newStatus = getUserStatus(userEvents);

  // 해당 유저의 success 로그에 afterStatus 업데이트
  for (const log of executionLogs) {
    if (log.userId === body.userId && log.result === "success") {
      log.afterStatus = newStatus;
    }
  }

  return NextResponse.json({ success: true });
}