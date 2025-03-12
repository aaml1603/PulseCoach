import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create test email content
    const subject = "PulseCoach Test Email";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Test Email from PulseCoach</h2>
        <p>Hello there,</p>
        <p>This is a test email to verify that the email sending functionality is working correctly.</p>
        <p>If you received this email, it means the system is properly configured.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
          <p><strong>Test Details:</strong></p>
          <p>Email: ${email}</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
        <p>Thank you for using PulseCoach!</p>
      </div>
    `;
    const text =
      "This is a test email from PulseCoach. If you're seeing this, email sending is working correctly.";

    // Send the email using our email API route
    const response = await fetch(`${request.nextUrl.origin}/api/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send test email");
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      data,
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: `Test email error: ${error.message}` },
      { status: 500 },
    );
  }
}
