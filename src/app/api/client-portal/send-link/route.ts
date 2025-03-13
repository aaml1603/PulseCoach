import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/sendgrid";
import { getPortalInviteTemplate } from "@/lib/email-templates";

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

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "SendGrid API key is not configured" },
        { status: 500 },
      );
    }

    // Create email content for portal invite using the template
    const subject = "Your Personal Training Portal Access";
    const html = getPortalInviteTemplate(
      client.name,
      coachName,
      portalUrl,
      client.email,
    );
    const text = `Hello ${client.name}, ${coachName} has invited you to access your personal training portal. Access your portal here: ${portalUrl}. This link is valid for 90 days and is unique to you.`;

    // Send email using SendGrid with improved deliverability
    await sendEmail(client.email, subject, html, text);

    return NextResponse.json({
      success: true,
      message: `Portal link sent to ${client.email}`,
    });
  } catch (error: any) {
    console.error("Error sending portal link:", error);

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
