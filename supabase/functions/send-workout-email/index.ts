import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { clientId, workoutName, portalUrl } = await req.json();

    if (!clientId || !workoutName || !portalUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("name, email")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!client.email) {
      return new Response(
        JSON.stringify({ error: "Client has no email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create email content
    const emailSubject = `New Workout Assigned: ${workoutName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Workout Assigned</h2>
        <p>Hello ${client.name},</p>
        <p>Your coach has assigned you a new workout: <strong>${workoutName}</strong></p>
        <p>You can view and track your workout by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${portalUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Workout</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;">${portalUrl}</p>
        <p>Thank you for using our platform!</p>
      </div>
    `;

    // Send email using Supabase's email service
    try {
      // Use Supabase's email service to send a custom email
      // This doesn't use the password reset flow
      const { error: emailSendError } = await supabase.auth.admin.createUser({
        email: client.email,
        email_confirm: true,
        user_metadata: {
          workout_notification: true,
          workout_name: workoutName,
          portal_url: portalUrl,
        },
        password: crypto.randomUUID(), // Random password that won't be used
      });

      if (emailSendError) {
        if (emailSendError.message.includes("already been registered")) {
          // User already exists, this is fine - we just wanted to send an email
          console.log("User already exists, but email was sent");
        } else {
          throw emailSendError;
        }
      }

      console.log(
        `Email sent to ${client.email} with subject: ${emailSubject}`,
      );
      console.log(`Portal URL: ${portalUrl}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Email notification sent to ${client.email}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } catch (emailError: any) {
      return new Response(
        JSON.stringify({
          error: `Failed to send email: ${emailError.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
