import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if SendGrid environment variables are set
    const hasSendGridApiKey = !!process.env.SENDGRID_API_KEY;
    const hasSendGridFromEmail = !!process.env.SENDGRID_FROM_EMAIL;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || null;

    // Return configuration status
    return NextResponse.json({
      hasSendGridApiKey,
      hasSendGridFromEmail,
      fromEmail: hasSendGridFromEmail ? fromEmail : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
