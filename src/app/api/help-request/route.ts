import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const userEmail = formData.get("userEmail") as string;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 },
      );
    }

    // Create email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Help Request from PulseCoach</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>User Account:</strong> ${userEmail || "Not logged in"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          This message was sent from the PulseCoach Help Center.
        </p>
      </div>
    `;

    const textContent = `
      New Help Request from PulseCoach
      From: ${name} (${email})
      User Account: ${userEmail || "Not logged in"}
      Subject: ${subject}
      
      Message:
      ${message}
      
      This message was sent from the PulseCoach Help Center.
    `;

    // Send email to support team
    await sendEmail(
      "contact@pulsecoach.org", // Support email address
      `Help Request: ${subject}`,
      htmlContent,
      textContent,
    );

    // Send confirmation email to user
    const userHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>We've Received Your Help Request</h2>
        <p>Hello ${name},</p>
        <p>Thank you for contacting PulseCoach support. We've received your request and will get back to you as soon as possible.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Date Submitted:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>For your records, here's a copy of your message:</p>
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <p>If you have any additional information to add, please reply to this email.</p>
        <p>Best regards,<br>The PulseCoach Support Team</p>
      </div>
    `;

    const userTextContent = `
      We've Received Your Help Request
      
      Hello ${name},
      
      Thank you for contacting PulseCoach support. We've received your request and will get back to you as soon as possible.
      
      Request Details:
      - Subject: ${subject}
      - Date Submitted: ${new Date().toLocaleString()}
      
      For your records, here's a copy of your message:
      
      ${message}
      
      If you have any additional information to add, please reply to this email.
      
      Best regards,
      The PulseCoach Support Team
    `;

    await sendEmail(
      email,
      "Your PulseCoach Support Request Has Been Received",
      userHtmlContent,
      userTextContent,
    );

    // Redirect to success page
    return NextResponse.redirect(new URL("/help/success", request.url));
  } catch (error: any) {
    console.error("Error processing help request:", error);

    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
