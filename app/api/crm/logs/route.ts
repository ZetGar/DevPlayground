import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("execution_logs")
    .select("*")
    .order("executed_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const mapped = data.map((l) => ({
    id: l.id,
    userId: l.user_id,
    campaignId: l.campaign_id,
    executedAt: l.executed_at,
    result: l.result,
    beforeStatus: l.before_status,
    afterStatus: l.after_status,
  }));

  return NextResponse.json(mapped);
}