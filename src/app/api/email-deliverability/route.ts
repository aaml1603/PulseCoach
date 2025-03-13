import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Return deliverability tips and configuration information
    return NextResponse.json({
      success: true,
      deliverabilityTips: [
        "Ensure your domain has proper SPF, DKIM, and DMARC records set up",
        "Use a consistent sender name and email address",
        "Avoid spam trigger words in subject lines",
        "Maintain a good sender reputation by avoiding spam complaints",
        "Implement proper authentication with SendGrid",
        "Warm up your sending domain gradually",
        "Keep your email lists clean and remove bounces",
        "Include an unsubscribe option in all emails",
        "Use a real reply-to address",
        "Ensure your HTML is properly formatted",
      ],
      configurationStatus: {
        sendgridApiKey: !!process.env.SENDGRID_API_KEY,
        sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || "Not configured",
        fromName: "PulseCoach",
        templateSystem: "Using consistent branded templates",
        authentication: "Using proper sender authentication",
      },
      spamAvoidanceMeasures: [
        "Using proper from name and email",
        "Including physical address in emails",
        "Using consistent branding and templates",
        "Avoiding excessive use of images",
        "Maintaining text-to-image ratio",
        "Avoiding spam trigger words",
        "Using proper HTML formatting",
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
