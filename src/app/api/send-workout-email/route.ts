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

    // Call our edge function to send a custom email instead of using the password reset
    const { data: emailData, error: emailError } =
      await supabase.functions.invoke("send-workout-email", {
        body: {
          clientId,
          workoutName,
          portalUrl,
          clientEmail: client.email,
          clientName: client.name,
        },
      });

    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
