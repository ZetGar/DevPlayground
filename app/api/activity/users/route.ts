import { NextResponse } from "next/server";
import { events } from "@/lib/activity/store";
import { calculateUserStatus } from "@/lib/activity/logic";

export async function GET() {
  const users = calculateUserStatus(events);

  return NextResponse.json(users);
}