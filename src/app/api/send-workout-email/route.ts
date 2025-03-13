import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import { getWorkoutAssignedTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { clientId, workoutName, portalUrl } = await request.json();

    if (!clientId || !workoutName || !portalUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("name, email")
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

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "SendGrid API key is not configured" },
        { status: 500 },
      );
    }

    // Create email content using the template
    const subject = `New Workout Assigned: ${workoutName}`;
    const html = getWorkoutAssignedTemplate(
      client.name,
      workoutName,
      portalUrl,
      client.email,
    );
    const text = `Hello ${client.name}, your coach has assigned you a new workout: ${workoutName}. View your workout here: ${portalUrl}`;

    // Send email using SendGrid with improved deliverability
    await sendEmail(client.email, subject, html, text);

    return NextResponse.json({
      success: true,
      message: `Workout email sent to ${client.email}`,
    });
  } catch (error: any) {
    console.error("Error sending workout email:", error);

    // Extract SendGrid specific error details if available
    const errorDetails = error.response
      ? {
          statusCode: error.response.statusCode,
          body: error.response.body,
          headers: error.response.headers,
        }
      : undefined;

    return NextResponse.json(
      {
        error: `Failed to send email: ${error.message}`,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
