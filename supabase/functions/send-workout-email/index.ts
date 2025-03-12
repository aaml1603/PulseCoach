import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@1.0.0";

// Log environment variables for debugging (excluding sensitive values)
console.log("Environment variables available:", {
  hasResendApiKey: !!Deno.env.get("RESEND_API_KEY"),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      clientName,
      clientEmail,
      workoutName,
      portalUrl,
      isPortalInvite,
      coachName,
      isTest,
    } = await req.json();

    if (!clientEmail) {
      return new Response(
        JSON.stringify({ error: "Client email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Initialize Resend with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const resend = new Resend(resendApiKey);

    // Create email content based on type
    let emailSubject, emailHtml;

    if (isTest) {
      // Test email
      emailSubject = "PulseCoach Test Email";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email from PulseCoach</h2>
          <p>Hello ${clientName},</p>
          <p>This is a test email to verify that the email sending functionality is working correctly.</p>
          <p>If you received this email, it means the system is properly configured.</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
            <p><strong>Test Details:</strong></p>
            <p>Email: ${clientEmail}</p>
            <p>Test URL: ${portalUrl}</p>
          </div>
          <p>Thank you for using PulseCoach!</p>
        </div>
      `;
    } else if (isPortalInvite) {
      // Portal invitation email
      emailSubject = "Your Personal Training Portal Access";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Your Personal Training Portal</h2>
          <p>Hello ${clientName},</p>
          <p>${coachName || "Your coach"} has invited you to access your personal training portal where you can view your workouts, track your progress, and communicate directly.</p>
          <p>Click the button below to access your portal:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Your Portal</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${portalUrl}</p>
          <p>This link is valid for 90 days and is unique to you. Please don't share it with others.</p>
        </div>
      `;
    } else {
      // Workout notification email
      emailSubject = `New Workout Assigned: ${workoutName}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Workout Assigned</h2>
          <p>Hello ${clientName},</p>
          <p>Your coach has assigned you a new workout: <strong>${workoutName}</strong></p>
          <p>You can view and track your workout by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background-color: #FF5733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Workout</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3b82f6;">${portalUrl}</p>
          <p>Thank you for using PulseCoach!</p>
        </div>
      `;
    }

    // Send email using Resend
    console.log("Sending email to:", clientEmail);
    console.log(
      "Using Resend API key:",
      resendApiKey ? "[API KEY SET]" : "[MISSING]",
    );

    const { data, error: sendError } = await resend.emails.send({
      from: "PulseCoach <onboarding@resend.dev>", // Use the verified sender domain from Resend
      to: [clientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    if (sendError) {
      console.error("Error sending email:", JSON.stringify(sendError));
      return new Response(
        JSON.stringify({
          error: `Failed to send email: ${sendError.message || JSON.stringify(sendError)}`,
          details: sendError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${clientEmail}`,
        data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(
      "Error in send-workout-email function:",
      JSON.stringify(error),
    );
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
        stack: error.stack,
        details: JSON.stringify(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
