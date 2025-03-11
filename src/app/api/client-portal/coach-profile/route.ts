import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}

export async function GET(request: NextRequest) {
  try {
    const coachId = request.nextUrl.searchParams.get("coachId");

    if (!coachId) {
      return NextResponse.json(
        { error: "Coach ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First get the coach profile
    const { data: profileData, error: profileError } = await supabase
      .from("coach_profiles")
      .select("*")
      .eq("user_id", coachId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // If no profile exists, get basic user info
    if (!profileData) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, full_name, email")
        .eq("id", coachId)
        .single();

      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }

      return NextResponse.json({
        display_name: userData.full_name || userData.name || "Your Coach",
        user_id: userData.id,
        email: userData.email,
      });
    }

    return NextResponse.json(profileData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
