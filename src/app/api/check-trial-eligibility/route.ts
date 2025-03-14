import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if this email has already used a trial
    const { data: existingUser } = await supabase
      .from("users")
      .select("trial_start_date")
      .eq("email", email)
      .maybeSingle();

    if (existingUser?.trial_start_date) {
      return NextResponse.json({
        eligible: false,
        reason: "This email has already used a free trial",
      });
    }

    // Import the trial prevention functions
    const { checkEmailDomainForTrialAbuse, checkIPForTrialAbuse } =
      await import("@/app/actions/trial-prevention");

    // Check for domain abuse (multiple accounts from same domain)
    const domainCheck = await checkEmailDomainForTrialAbuse(email);
    if (!domainCheck.allowed) {
      return NextResponse.json({
        eligible: false,
        reason:
          domainCheck.reason || "Trial not available for this email domain",
      });
    }

    // Check for IP abuse (multiple accounts from same IP)
    const ipCheck = await checkIPForTrialAbuse(clientIP);
    if (!ipCheck.allowed) {
      return NextResponse.json({
        eligible: false,
        reason: ipCheck.reason || "Trial not available from your location",
      });
    }

    return NextResponse.json({
      eligible: true,
    });
  } catch (error: any) {
    console.error("Error checking trial eligibility:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
