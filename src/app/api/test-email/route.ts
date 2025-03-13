import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import { getTestEmailTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "SendGrid API key is not configured" },
        { status: 500 },
      );
    }

    // Create test email content using the template
    const subject = "PulseCoach Test Email";
    const html = getTestEmailTemplate(email);
    const text =
      "This is a test email from PulseCoach. If you're seeing this, email sending is working correctly.";

    // Send email using SendGrid with improved deliverability
    await sendEmail(email, subject, html, text);

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      provider: "sendgrid",
      fromEmail: process.env.SENDGRID_FROM_EMAIL || "noreply@pulsecoach.com",
    });
  } catch (error: any) {
    console.error("Test email error:", error);

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
        error: `Test email error: ${error.message}`,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
