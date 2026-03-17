import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/activity/store";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newEvent = {
    userId: body.userId,
    type: body.type,
    timestamp: Date.now(),
  };

  events.push(newEvent);

  return NextResponse.json({ success: true });
}