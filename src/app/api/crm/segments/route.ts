import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateSegmentRequest } from "@/lib/crm/types";

export async function GET() {
  const { data, error } = await supabase
    .from("segments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const mapped = data.map((s) => ({
    id: s.id,
    name: s.name,
    conditions: s.conditions,
    createdAt: s.created_at,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const body: CreateSegmentRequest = await req.json();

  const newSegment = {
    id: crypto.randomUUID(),
    name: body.name,
    conditions: body.conditions,
    created_at: Date.now(),
  };

  const { error } = await supabase.from("segments").insert(newSegment);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(
    { ...newSegment, createdAt: newSegment.created_at },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  const { error } = await supabase.from("segments").delete().eq("id", id);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}