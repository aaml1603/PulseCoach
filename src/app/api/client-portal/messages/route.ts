import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const clientId = request.nextUrl.searchParams.get("clientId");

    if (!token && !clientId) {
      return NextResponse.json(
        { error: "Access token or client ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    let client;

    if (token) {
      // Client portal access - verify token
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, coach_id")
        .eq("access_token", token)
        .single();

      if (clientError || !clientData) {
        return NextResponse.json(
          { error: "Invalid or expired access token" },
          { status: 401 },
        );
      }

      client = clientData;
    } else {
      // Coach access - verify coach has access to this client
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, coach_id")
        .eq("id", clientId)
        .eq("coach_id", user.id)
        .single();

      if (clientError || !clientData) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 },
        );
      }

      client = clientData;
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: messagesError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, clientId, content, isFromClient } = await request.json();

    if ((!token && !clientId) || !content) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    let client;
    let coachId;

    if (token) {
      // Client portal access - verify token
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, coach_id")
        .eq("access_token", token)
        .single();

      if (clientError || !clientData) {
        return NextResponse.json(
          { error: "Invalid or expired access token" },
          { status: 401 },
        );
      }

      client = clientData;
      coachId = clientData.coach_id;

      // Ensure message is from client when using token auth
      if (!isFromClient) {
        return NextResponse.json(
          { error: "Unauthorized message source" },
          { status: 403 },
        );
      }
    } else {
      // Coach access - verify coach has access to this client
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id, coach_id")
        .eq("id", clientId)
        .eq("coach_id", user.id)
        .single();

      if (clientError || !clientData) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 },
        );
      }

      client = clientData;
      coachId = user.id;

      // Ensure message is from coach when using coach auth
      if (isFromClient) {
        return NextResponse.json(
          { error: "Unauthorized message source" },
          { status: 403 },
        );
      }
    }

    // Insert the message
    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        client_id: client.id,
        coach_id: coachId,
        content,
        is_from_client: isFromClient,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Create a notification for the coach if message is from client
    if (isFromClient) {
      // Get client name
      const { data: clientData } = await supabase
        .from("clients")
        .select("name")
        .eq("id", client.id)
        .single();

      await supabase.from("notifications").insert({
        user_id: coachId,
        title: "New Message",
        message: `${clientData?.name || "Your client"} sent you a message: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
        type: "message",
        related_entity_id: client.id,
        related_entity_type: "client",
        is_read: false,
      });
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { messageIds } = await request.json();

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: "Message IDs array is required" },
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

    // Mark messages as read
    const { error: updateError } = await supabase
      .from("messages")
      .update({ is_read: true })
      .in("id", messageIds)
      .eq("coach_id", user.id); // Ensure coach can only mark their own messages

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
