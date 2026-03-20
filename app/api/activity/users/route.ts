import { NextResponse } from "next/server";
import { events } from "@/lib/activity/store";
import { groupEventsByUser } from "@/lib/activity/logic";
import { getUserStatus } from "../../../activity-tracker/domain/userStatus";
import { getRecommendation } from "@/app/activity-tracker/domain/recommendation";
export async function GET() {
  const grouped = groupEventsByUser(events);

  const users = grouped.map((user) => {
    const last = user.events[user.events.length - 1];
    const rec = getRecommendation(user.events);

    return {
      userId: user.userId,
      events: user.events,
      lastActive: last?.timestamp ?? 0,
      status: getUserStatus(user.events),
      recommendation: rec,
    };
  });

  return NextResponse.json(users);
}