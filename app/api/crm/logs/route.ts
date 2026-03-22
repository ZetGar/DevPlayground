import { NextResponse } from "next/server";
import { executionLogs } from "@/lib/crm/store";

// 실행 로그 조회
export async function GET() {
  const sorted = [...executionLogs].sort((a, b) => b.executedAt - a.executedAt);
  return NextResponse.json(sorted);
}