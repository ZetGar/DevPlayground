import { NextRequest, NextResponse } from "next/server";
import { campaigns, executionLogs } from "@/lib/crm/store";
import { events } from "@/lib/activity/store";
import { CreateCampaignRequest } from "@/lib/crm/types";
import { groupEventsByUser } from "@/lib/activity/logic";
import { getUserStatus } from "@/app/activity-tracker/domain/userStatus";
import { evaluateSegment } from "@/lib/crm/logic";

export async function GET() {
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const body: CreateCampaignRequest = await req.json();

  const newCampaign = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  campaigns.push(newCampaign);

  const grouped = groupEventsByUser(events);

  for (const user of grouped) {
    const status = getUserStatus(user.events);
    const matched = evaluateSegment(newCampaign.segmentId, {
      userId: user.userId,
      status,
      events: user.events,
    });

    executionLogs.push({
      id: crypto.randomUUID(),
      userId: user.userId,
      campaignId: newCampaign.id,
      executedAt: Date.now(),
      result: matched ? "success" : "skipped",
      beforeStatus: status, // ← 실행 시점 상태 저장
    });
  }

  return NextResponse.json(newCampaign, { status: 201 });
}