import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { clientId, workoutName, portalUrl, to, subject, html } =
      await request.json();

    // If direct email parameters are provided, use those
    if (to && subject && html) {
      // Set up nodemailer with environment variables
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Send the email
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || "noreply@pulsecoach.com",
        to,
        subject,
        html,
      });

      return NextResponse.json({ success: true });
    }

    // Otherwise, use the client ID to look up information
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, name, email, coach_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!client.email) {
      return NextResponse.json(
        { error: "Client does not have an email address" },
        { status: 400 },
      );
    }

    // Get coach details
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("display_name")
      .eq("user_id", client.coach_id)
      .single();

    const coachName = coachProfile?.display_name || "Your Coach";

    // Create email content
    let emailHtml;
    let emailSubject;

    if (portalUrl) {
      // Portal access email
      emailSubject = `Your Fitness Portal from ${coachName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/xFQGdgC.png" alt="PulseCoach Logo" style="width: 80px; height: 80px;">
            <h1 style="color: #FF5733; margin-top: 10px;">PulseCoach</h1>
          </div>
          
          <h2 style="color: #333333;">Hello ${client.name},</h2>
          
          <p style="color: #555555; line-height: 1.5;">
            ${coachName} has created a personal fitness portal for you to access your workouts, track your progress, and communicate directly.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Access Your Portal
            </a>
          </div>
          
          <p style="color: #555555; line-height: 1.5;">
            This link is valid for 90 days and is unique to you. Please don't share it with others.
          </p>
          
          <p style="color: #555555; line-height: 1.5;">
            If you have any questions, you can reply directly to your coach through the portal.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px; text-align: center;">
            <p>© ${new Date().getFullYear()} PulseCoach. All rights reserved.</p>
          </div>
        </div>
      `;
    } else if (workoutName) {
      // Workout notification email
      emailSubject = `New Workout Assigned: ${workoutName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/xFQGdgC.png" alt="PulseCoach Logo" style="width: 80px; height: 80px;">
            <h1 style="color: #FF5733; margin-top: 10px;">PulseCoach</h1>
          </div>
          
          <h2 style="color: #333333;">Hello ${client.name},</h2>
          
          <p style="color: #555555; line-height: 1.5;">
            ${coachName} has assigned you a new workout: <strong>${workoutName}</strong>
          </p>
          
          <p style="color: #555555; line-height: 1.5;">
            Log in to your client portal to view the details and track your progress.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px; text-align: center;">
            <p>© ${new Date().getFullYear()} PulseCoach. All rights reserved.</p>
          </div>
        </div>
      `;
    } else {
      return NextResponse.json(
        { error: "Either workoutName or portalUrl is required" },
        { status: 400 },
      );
    }

    // Set up nodemailer with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || "noreply@pulsecoach.com",
      to: client.email,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 },
    );
  }
}
