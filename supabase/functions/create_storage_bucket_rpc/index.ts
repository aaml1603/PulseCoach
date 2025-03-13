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
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: "Missing Supabase credentials in environment variables",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Create the progress-pictures bucket directly
    console.log("Creating progress-pictures bucket via edge function");

    // Check if bucket already exists
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      return new Response(
        JSON.stringify({
          error: `Failed to list buckets: ${listError.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const bucketExists = buckets?.some(
      (bucket) => bucket.name === "progress-pictures",
    );

    if (bucketExists) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Bucket 'progress-pictures' already exists",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket(
      "progress-pictures",
      {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      },
    );

    if (error) {
      return new Response(
        JSON.stringify({
          error: `Failed to create bucket: ${error.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Set up bucket policies for read access - with error handling for each policy separately
    try {
      // First check if the bucket exists and is accessible
      const { data: bucketCheck, error: bucketCheckError } =
        await supabaseAdmin.storage
          .from("progress-pictures")
          .list("", { limit: 1 });

      if (bucketCheckError) {
        console.warn(
          "Bucket may not be fully initialized yet:",
          bucketCheckError,
        );
      } else {
        console.log("Bucket is accessible, attempting to create policies");

        // Try to create read policy
        try {
          await supabaseAdmin.storage
            .from("progress-pictures")
            .createPolicy("give users read access", {
              name: "give users read access",
              definition: {
                statements: [
                  {
                    effect: "allow",
                    principal: { authenticated: true },
                    actions: ["select"],
                    resources: ["storage/progress-pictures/*"],
                  },
                ],
              },
            });
          console.log("Read policy created successfully");
        } catch (readPolicyError) {
          console.warn("Error creating read policy:", readPolicyError);
        }

        // Try to create write policy separately
        try {
          await supabaseAdmin.storage
            .from("progress-pictures")
            .createPolicy("give users write access", {
              name: "give users write access",
              definition: {
                statements: [
                  {
                    effect: "allow",
                    principal: { authenticated: true },
                    actions: ["insert", "update", "delete"],
                    resources: ["storage/progress-pictures/*"],
                  },
                ],
              },
            });
          console.log("Write policy created successfully");
        } catch (writePolicyError) {
          console.warn("Error creating write policy:", writePolicyError);
        }
      }
    } catch (policyError) {
      console.warn(
        "Error setting up policies, but bucket was created:",
        policyError,
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bucket 'progress-pictures' created successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in create_storage_bucket_rpc function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
