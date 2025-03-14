import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { bucketName } = await req.json();

    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: "Bucket name is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Edge function: Creating bucket '${bucketName}'`);

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: "Missing Supabase credentials in environment variables",
          envVars: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseServiceKey,
          },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if bucket already exists
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error(`Failed to list buckets: ${listError.message}`);
      // Continue anyway to try creating the bucket
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (bucketExists) {
      console.log(`Bucket '${bucketName}' already exists`);
      return new Response(
        JSON.stringify({
          success: true,
          message: `Bucket '${bucketName}' already exists`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create the bucket
    console.log("Attempting to create bucket with service role key...");
    const { data, error } = await supabaseAdmin.storage.createBucket(
      bucketName,
      {
        public: true, // Make it public to simplify access
        fileSizeLimit: 5242880, // 5MB
      },
    );

    if (error) {
      console.error(`Failed to create bucket: ${error.message}`);
      return new Response(
        JSON.stringify({
          error: `Failed to create bucket: ${error.message}`,
          details: error,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Bucket created successfully, setting up policies...");

    // Set up bucket policies for read access
    try {
      const { error: readPolicyError } = await supabaseAdmin.storage
        .from(bucketName)
        .createPolicy("give users read access", {
          name: "give users read access",
          definition: {
            statements: [
              {
                effect: "allow",
                principal: { authenticated: true },
                actions: ["select"],
                resources: [`storage/${bucketName}/*`],
              },
            ],
          },
        });

      if (readPolicyError) {
        console.warn(
          `Warning: Failed to create read policy: ${readPolicyError.message}`,
        );
      } else {
        console.log("Read policy created successfully");
      }
    } catch (policyError) {
      console.warn(`Exception creating read policy: ${policyError.message}`);
    }

    // Set up bucket policies for write access
    try {
      const { error: writePolicyError } = await supabaseAdmin.storage
        .from(bucketName)
        .createPolicy("give users write access", {
          name: "give users write access",
          definition: {
            statements: [
              {
                effect: "allow",
                principal: { authenticated: true },
                actions: ["insert", "update", "delete"],
                resources: [`storage/${bucketName}/*`],
              },
            ],
          },
        });

      if (writePolicyError) {
        console.warn(
          `Warning: Failed to create write policy: ${writePolicyError.message}`,
        );
      } else {
        console.log("Write policy created successfully");
      }
    } catch (policyError) {
      console.warn(`Exception creating write policy: ${policyError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Bucket '${bucketName}' created successfully`,
        data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in create-storage-bucket function:", error);
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
