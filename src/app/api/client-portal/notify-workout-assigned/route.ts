import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import { getWorkoutAssignedTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { clientId, workoutId } = await request.json();

    if (!clientId || !workoutId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("name, email, access_token, coach_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!client.email) {
      return NextResponse.json(
        { error: "Client has no email address" },
        { status: 400 },
      );
    }

    // Get workout details
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .select("name")
      .eq("id", workoutId)
      .single();

    if (workoutError || !workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Get coach details for the email
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("display_name")
      .eq("user_id", client.coach_id)
      .single();

    const coachName = coachProfile?.display_name || "Your Coach";

    // Generate the portal URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      // Fallback to request headers if environment variable not set
      const host = request.headers.get("host") || request.nextUrl.host;
      const protocol = host.includes("localhost") ? "http" : "https";
      baseUrl = `${protocol}://${host}`;
    }

    // If client has an access token, use it to create a portal URL
    let portalUrl = `${baseUrl}/dashboard/clients/${clientId}`;
    if (client.access_token) {
      portalUrl = `${baseUrl}/client-portal/${client.access_token}`;
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "SendGrid API key is not configured" },
        { status: 500 },
      );
    }

    // Create email content using the template
    const subject = `New Workout Assigned: ${workout.name}`;
    const html = getWorkoutAssignedTemplate(
      client.name,
      workout.name,
      portalUrl,
      client.email,
    );
    const text = `Hello ${client.name}, your coach has assigned you a new workout: ${workout.name}. View your workout here: ${portalUrl}`;

    // Send email using SendGrid
    await sendEmail(client.email, subject, html, text);

    return NextResponse.json({
      success: true,
      message: `Workout notification email sent to ${client.email}`,
    });
  } catch (error: any) {
    console.error("Error sending workout notification email:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
