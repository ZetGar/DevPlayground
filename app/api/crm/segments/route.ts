import { NextRequest, NextResponse } from "next/server";
import { segments } from "@/lib/crm/store";
import { CreateSegmentRequest } from "@/lib/crm/types";

export async function GET() {
  return NextResponse.json(segments);
}

export async function POST(req: NextRequest) {
  const body: CreateSegmentRequest = await req.json();

  const newSegment = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  segments.push(newSegment);

  return NextResponse.json(newSegment, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const index = segments.findIndex((s) => s.id === id);
  if (index === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  segments.splice(index, 1);
  return NextResponse.json({ success: true });
}