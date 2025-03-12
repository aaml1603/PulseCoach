import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the user is authorized
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the client belongs to this coach
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, coach_id, name, email")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (client.coach_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!client.email) {
      return NextResponse.json(
        { error: "Client does not have an email address" },
        { status: 400 },
      );
    }

    // Generate a new access token
    const accessToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // Token valid for 90 days

    // Update the client with the new access token
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        access_token: accessToken,
        access_token_expires_at: expiresAt.toISOString(),
      })
      .eq("id", clientId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Get the coach profile for the email
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    const coachName = coachProfile?.display_name || "Your Coach";

    // Generate the portal URL with absolute path that works across any device
    // Get the base URL from environment variable or fallback to request headers
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      // Fallback to request headers if environment variable not set
      const host = request.headers.get("host") || request.nextUrl.host;
      const protocol = host.includes("localhost") ? "http" : "https";
      baseUrl = `${protocol}://${host}`;
    }

    const portalUrl = `${baseUrl}/client-portal/${accessToken}`;

    // Create email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.imgur.com/xFQGdgC.png" alt="PulseCoach Logo" style="width: 80px; height: 80px;">
          <h1 style="color: #FF5733; margin-top: 10px;">PulseCoach</h1>
        </div>
        
        <h2 style="color: #333333;">Hello ${client.name},</h2>
        
        <p style="color: #555555; line-height: 1.5;">
          ${coachName} has created a personal fitness portal for you to access your workouts, track your progress, and communicate directly.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${portalUrl}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Access Your Portal
          </a>
        </div>
        
        <p style="color: #555555; line-height: 1.5;">
          This link is valid for 90 days and is unique to you. Please don't share it with others.
        </p>
        
        <p style="color: #555555; line-height: 1.5;">
          If you have any questions, you can reply directly to your coach through the portal.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px; text-align: center;">
          <p>© ${new Date().getFullYear()} PulseCoach. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email using Supabase Edge Function
    const { data: emailData, error: emailError } =
      await supabase.functions.invoke("supabase-functions-send-workout-email", {
        body: {
          to: client.email,
          subject: `Your Fitness Portal from ${coachName}`,
          html: emailHtml,
        },
      });

    if (emailError) {
      return NextResponse.json(
        { error: "Failed to send email: " + emailError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Portal link sent to ${client.email}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
