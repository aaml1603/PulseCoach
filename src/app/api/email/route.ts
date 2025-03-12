import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Call our edge function to send email
    console.log("Sending email to:", to);
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: { to, subject, html, text },
      // Add a longer timeout for SMTP operations
      options: {
        timeout: 60000, // 60 seconds timeout
      },
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent to ${to}`,
      data,
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: `Email sending error: ${error.message}` },
      { status: 500 },
    );
  }
}
