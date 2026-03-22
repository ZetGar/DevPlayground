import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/activity/store";
import { supabase } from "@/lib/supabase";
import { getUserStatus } from "@/app/activity-tracker/domain/userStatus";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newEvent = {
    userId: body.userId,
    type: body.type,
    timestamp: Date.now(),
  };

  events.push(newEvent);

  // 이 유저의 최신 상태 계산
  const userEvents = events.filter((e) => e.userId === body.userId);
  const newStatus = getUserStatus(userEvents);

  // Supabase execution_logs에서 해당 유저의 success 로그 afterStatus 갱신
  await supabase
    .from("execution_logs")
    .update({ after_status: newStatus })
    .eq("user_id", body.userId)
    .eq("result", "success");

  return NextResponse.json({ success: true });
}