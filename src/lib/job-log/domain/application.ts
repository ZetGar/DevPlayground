import { supabase } from "@/lib/supabase";
import { Application, ApplicationRow, Stage } from "../types";
import { toApplication, toApplicationRow } from "./applicationMapper";

// 전체 조회
export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ApplicationRow[]).map(toApplication);
}

// 단건 조회
export async function getApplication(id: string): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return toApplication(data as ApplicationRow);
}

// 생성
export async function createApplication(
  input: Omit<Application, "id" | "createdAt">
): Promise<Application> {
  const row = toApplicationRow(input);
  const { data, error } = await supabase
    .from("applications")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return toApplication(data as ApplicationRow);
}

// 수정
export async function updateApplication(
  id: string,
  input: Partial<Omit<Application, "id" | "createdAt">>
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .update({
      company_name: input.companyName,
      job_title: input.jobTitle,
      domain: input.domain,
      company_size: input.companySize,
      tech_stack: input.techStack,
      stage: input.stage,
      applied_at: input.appliedAt,
      deadline: input.deadline,
      url: input.url,
      memo: input.memo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return toApplication(data as ApplicationRow);
}

// stage만 업데이트 (칸반 드래그용)
export async function updateStage(id: string, stage: Stage): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .update({ stage })
    .eq("id", id);

  if (error) throw error;
}

// 삭제
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
