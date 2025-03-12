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

    // Use the new API route to send the email
    const response = await fetch(`${baseUrl}/api/send-workout-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: client.id,
        portalUrl: portalUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({
      success: true,
      message: `Portal link sent to ${client.email}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
