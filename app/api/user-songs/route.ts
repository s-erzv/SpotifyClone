import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return NextResponse.json([]);

  const { data } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", user.id);

  return NextResponse.json(data || []);
};
