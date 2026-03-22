import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { events } from "@/lib/activity/store";
import { CreateCampaignRequest } from "@/lib/crm/types";
import { groupEventsByUser } from "@/lib/activity/logic";
import { getUserStatus } from "@/app/activity-tracker/domain/userStatus";
import { evaluateSegmentById } from "@/lib/crm/logic";

export async function GET() {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const mapped = data.map((c) => ({
    id: c.id,
    name: c.name,
    segmentId: c.segment_id,
    triggerType: c.trigger_type,
    actionType: c.action_type,
    actionPayload: c.action_payload,
    createdAt: c.created_at,
    isActive: c.is_active,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const body: CreateCampaignRequest = await req.json();

  const newCampaign = {
    id: crypto.randomUUID(),
    name: body.name,
    segment_id: body.segmentId,
    trigger_type: body.triggerType,
    action_type: body.actionType,
    action_payload: body.actionPayload,
    created_at: Date.now(),
    is_active: true,
  };

  const { error } = await supabase.from("campaigns").insert(newCampaign);
  if (error) return NextResponse.json({ error }, { status: 500 });

  // 세그먼트 조건에 맞는 유저에게 즉시 실행
  const grouped = groupEventsByUser(events);
  const logs = [];

  for (const user of grouped) {
    const status = getUserStatus(user.events);
    const matched = await evaluateSegmentById(body.segmentId, {
      userId: user.userId,
      status,
      events: user.events,
    });

    logs.push({
      id: crypto.randomUUID(),
      user_id: user.userId,
      campaign_id: newCampaign.id,
      executed_at: Date.now(),
      result: matched ? "success" : "skipped",
      before_status: status,
    });
  }

  if (logs.length > 0) {
    await supabase.from("execution_logs").insert(logs);
  }

  return NextResponse.json(
    {
      ...newCampaign,
      segmentId: newCampaign.segment_id,
      triggerType: newCampaign.trigger_type,
      actionType: newCampaign.action_type,
      actionPayload: newCampaign.action_payload,
      createdAt: newCampaign.created_at,
      isActive: newCampaign.is_active,
    },
    { status: 201 }
  );
}