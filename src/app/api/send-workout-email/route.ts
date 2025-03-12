import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Create email content
    const subject = `New Workout Assigned: ${workoutName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Workout Assigned</h2>
        <p>Hello ${client.name},</p>
        <p>Your coach has assigned you a new workout: <strong>${workoutName}</strong></p>
        <p>You can view and track your workout by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${portalUrl}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Workout</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;">${portalUrl}</p>
        <p>Thank you for using PulseCoach!</p>
      </div>
    `;
    const text = `Hello ${client.name}, your coach has assigned you a new workout: ${workoutName}. View your workout here: ${portalUrl}`;

    // Send the email using our email API route
    const emailResponse = await fetch(`${request.nextUrl.origin}/api/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: client.email,
        subject,
        html,
        text,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Failed to send email: " + (emailData.error || "Unknown error"),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
