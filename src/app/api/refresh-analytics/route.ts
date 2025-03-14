import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { getClientAnalytics } from "@/app/actions/analytics";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the user is authorized
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get fresh analytics data
    const analytics = await getClientAnalytics(user.id);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error("Error refreshing analytics:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
