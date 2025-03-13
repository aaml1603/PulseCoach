import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import {
  getPortalInviteTemplate,
  getBaseEmailTemplate,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const {
      to,
      subject,
      html,
      text,
      isPortalInvite = false,
      clientName = "",
      coachName = "",
      portalUrl = "",
    } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email is required" },
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

    // Generate custom portal invite email if needed
    let emailHtml = html;
    let emailSubject = subject;
    let emailText = text;

    if (isPortalInvite && portalUrl) {
      emailSubject = "Your Personal Training Portal Access";
      emailHtml = getPortalInviteTemplate(clientName, coachName, portalUrl, to);
      emailText = `Hello ${clientName}, ${coachName || "Your coach"} has invited you to access your personal training portal. Access your portal here: ${portalUrl}. This link is valid for 90 days and is unique to you.`;
    } else if (html) {
      // Wrap custom HTML in our base template to maintain consistent styling
      emailHtml = getBaseEmailTemplate(html, to);
    }

    // Send email using SendGrid with improved deliverability
    await sendEmail(to, emailSubject, emailHtml, emailText);

    return NextResponse.json({
      success: true,
      message: `Email sent to ${to} via SendGrid`,
      provider: "sendgrid",
    });
  } catch (error: any) {
    console.error("Email sending error:", error);

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
        error: `Email sending error: ${error.message}`,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
