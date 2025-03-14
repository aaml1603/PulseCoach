import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
    const { url } = await req.json();
    const testUrl = url || "https://jsonplaceholder.typicode.com/todos/1";

    console.log(`Testing connectivity to: ${testUrl}`);

    // Test fetch to the provided URL
    const startTime = Date.now();
    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const endTime = Date.now();

    // Get response details
    const responseText = await response.text();
    const responseTime = endTime - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries()),
        responseSize: responseText.length,
        response:
          responseText.substring(0, 500) +
          (responseText.length > 500 ? "..." : ""),
        environment: {
          runtime: "Deno",
          version: Deno.version.deno,
          hasEnvVars: {
            SMTP_HOST: !!Deno.env.get("SMTP_HOST"),
            SMTP_PORT: !!Deno.env.get("SMTP_PORT"),
            SMTP_USER: !!Deno.env.get("SMTP_USER"),
            SMTP_PASS: !!Deno.env.get("SMTP_PASS"),
            FROM_EMAIL: !!Deno.env.get("FROM_EMAIL"),
          },
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in test-connectivity function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
        stack: error.stack,
        name: error.name,
        cause: error.cause ? JSON.stringify(error.cause) : undefined,
        details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
