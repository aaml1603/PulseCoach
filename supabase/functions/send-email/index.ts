import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
      to,
      subject,
      html,
      text,
      from = Deno.env.get("FROM_EMAIL") || "noreply@pulsecoach.com",
    } = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ error: "Recipient email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get SMTP configuration from environment variables
    const host = Deno.env.get("SMTP_HOST");
    const port = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const username = Deno.env.get("SMTP_USER");
    const password = Deno.env.get("SMTP_PASS");
    const secure = Deno.env.get("SMTP_SECURE") === "true";

    // Log configuration (without sensitive data)
    console.log("SMTP Configuration:", {
      host,
      port,
      hasUsername: !!username,
      hasPassword: !!password,
      secure,
      from,
    });

    if (!host || !username || !password) {
      return new Response(
        JSON.stringify({ error: "SMTP configuration is incomplete" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: host,
        port: port,
        tls: secure,
        auth: {
          username: username,
          password: password,
        },
        // Disable TLS verification for troubleshooting
        tlsOptions: {
          rejectUnauthorized: false,
        },
      },
    });

    // Send email
    console.log(`Sending email to: ${to}`);
    await client.send({
      from: from,
      to: to,
      subject: subject,
      content: text,
      html: html,
    });

    // Close connection
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${to}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
        details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
