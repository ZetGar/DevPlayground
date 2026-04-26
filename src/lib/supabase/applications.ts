import { createClient } from "@/lib/supabase/client";

export type UserQuestion = {
  id: string;
  question: string;
  answer: string;
  memo?: string;
  created_at: string;
  updated_at: string;
};

export async function updateUserQuestions(
  applicationId: string,
  userQuestions: UserQuestion[]
) {
  const supabase = createClient();

  const { data: current, error: fetchError } = await supabase
    .from("applications")
    .select("ai_guide")
    .eq("id", applicationId)
    .single();

  if (fetchError) throw fetchError;

  const newAiGuide = {
    ...(current?.ai_guide ?? {}),
    user_questions: userQuestions,
  };

  const { error } = await supabase
    .from("applications")
    .update({ ai_guide: newAiGuide })
    .eq("id", applicationId);

  if (error) throw error;
}

export type ApplicationUpdate = {
  company_name?: string;
  job_title?: string;
  domain?: string;
  job_url?: string;
  company_size?: string;
  stage?: string;
  applied_at?: string;
};

export async function updateApplication(
  applicationId: string,
  fields: ApplicationUpdate
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .update(fields)
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}