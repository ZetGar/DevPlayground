import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import JobLogClient from "./JobLogClient";

export default async function Page() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isGuest = cookieStore.get("guest");

  return (
    <JobLogClient
      user={user}
      isGuest={!!isGuest}
    />
  );
}