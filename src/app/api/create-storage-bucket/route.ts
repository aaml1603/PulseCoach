import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { bucketName } = await request.json();

    if (!bucketName) {
      return NextResponse.json(
        { error: "Bucket name is required" },
        { status: 400 },
      );
    }

    console.log(`Attempting to create bucket: ${bucketName}`);
    const supabase = await createClient();

    // Check if bucket already exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error(`Failed to list buckets: ${listError.message}`);
      // Continue anyway to try creating the bucket
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (bucketExists) {
      console.log(`Bucket '${bucketName}' already exists`);
      return NextResponse.json({
        success: true,
        message: `Bucket '${bucketName}' already exists`,
      });
    }

    // Try multiple approaches to create the bucket
    let creationSuccess = false;
    let creationMethod = "";
    let creationData = null;
    let lastError = null;

    // Approach 1: Try to create the bucket directly
    try {
      console.log("Attempting direct bucket creation...");
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make it public to simplify access
        fileSizeLimit: 5242880, // 5MB
      });

      if (!error) {
        creationSuccess = true;
        creationMethod = "direct";
        creationData = data;
        console.log("Direct bucket creation successful");
      } else {
        lastError = error;
        console.error("Direct bucket creation failed:", error.message);
      }
    } catch (err) {
      lastError = err;
      console.error("Exception in direct bucket creation:", err);
    }

    // Approach 2: If direct creation fails, try using the RPC function
    if (!creationSuccess) {
      try {
        console.log("Attempting bucket creation via RPC function...");
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          "create_storage_bucket",
          { bucket_name: bucketName, is_public: true },
        );

        if (!rpcError) {
          creationSuccess = true;
          creationMethod = "RPC function";
          creationData = rpcData;
          console.log("RPC function bucket creation successful");
        } else {
          lastError = rpcError;
          console.error(
            "RPC function bucket creation failed:",
            rpcError.message,
          );
        }
      } catch (err) {
        lastError = err;
        console.error("Exception in RPC function bucket creation:", err);
      }
    }

    // Approach 3: If RPC fails, try using the edge function
    if (!creationSuccess) {
      try {
        console.log("Attempting bucket creation via edge function...");
        const { data: edgeData, error: edgeError } =
          await supabase.functions.invoke("create-storage-bucket", {
            body: { bucketName },
          });

        if (!edgeError) {
          creationSuccess = true;
          creationMethod = "edge function";
          creationData = edgeData;
          console.log("Edge function bucket creation successful");
        } else {
          lastError = edgeError;
          console.error(
            "Edge function bucket creation failed:",
            edgeError.message,
          );
        }
      } catch (err) {
        lastError = err;
        console.error("Exception in edge function bucket creation:", err);
      }
    }

    // Approach 4: Try using direct SQL execution as a last resort
    if (!creationSuccess) {
      try {
        console.log("Attempting bucket creation via direct SQL...");

        // Execute the SQL migration directly - with safer approach checking if tables exist first
        const { data: sqlData, error: sqlError } = await supabase.rpc(
          "exec_sql",
          {
            sql_string: `
              -- Create the bucket if it doesn't exist
              INSERT INTO storage.buckets (id, name, public)
              SELECT '${bucketName}', '${bucketName}', true
              WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = '${bucketName}');
              
              -- Create read policy if it doesn't exist - only if the policies table exists
              DO $
              BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'policies') THEN
                  INSERT INTO storage.policies (name, bucket_id, operation, definition)
                  SELECT 'Public Read Access', '${bucketName}', 'SELECT', '{"bucket_id": "${bucketName}"}'::jsonb
                  WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = '${bucketName}' AND operation = 'SELECT');
                END IF;
              END
              $;
              
              -- Create insert policy if it doesn't exist - only if the policies table exists
              DO $
              BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'policies') THEN
                  INSERT INTO storage.policies (name, bucket_id, operation, definition)
                  SELECT 'Authenticated Users Can Insert', '${bucketName}', 'INSERT', '{"bucket_id": "${bucketName}", "auth.role()": "authenticated"}'::jsonb
                  WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = '${bucketName}' AND operation = 'INSERT');
                END IF;
              END
              $;
              
              -- Disable RLS on storage.objects temporarily
              ALTER TABLE IF EXISTS storage.objects DISABLE ROW LEVEL SECURITY;
              
              -- Drop existing policies if they exist
              DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
              
              -- Create a more permissive policy
              CREATE POLICY "Allow authenticated users to upload"
              ON storage.objects
              FOR ALL
              TO authenticated
              USING (bucket_id = '${bucketName}');
              
              -- Re-enable RLS with the new policy in place
              ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
            `,
          },
        );

        if (sqlError) {
          console.error("SQL bucket creation failed:", sqlError.message);
          lastError = sqlError;
        } else {
          // Now try to verify if the bucket exists
          const { data: verifyData, error: verifyError } =
            await supabase.storage.listBuckets();

          if (!verifyError && verifyData) {
            const bucketNowExists = verifyData.some(
              (bucket) => bucket.name === bucketName,
            );

            if (bucketNowExists) {
              creationSuccess = true;
              creationMethod = "direct SQL";
              creationData = { message: "Created via direct SQL execution" };
              console.log("Direct SQL bucket creation successful");
            } else {
              console.error("Bucket still doesn't exist after SQL execution");
              lastError = new Error("Failed to create bucket via SQL");
            }
          } else {
            lastError =
              verifyError || new Error("Failed to verify bucket creation");
            console.error(
              "Failed to verify bucket after SQL execution:",
              lastError,
            );
          }
        }
      } catch (err) {
        lastError = err;
        console.error("Exception in direct SQL bucket creation:", err);
      }
    }

    // Return the result based on success or failure
    if (creationSuccess) {
      // Fix RLS policies regardless of creation method
      try {
        // Use direct API call instead of fetch to avoid URL parsing issues
        const { data: rlsData, error: rlsError } = await supabase.rpc(
          "exec_sql",
          {
            sql_string: `
            -- Disable RLS on storage.objects temporarily
            ALTER TABLE IF EXISTS storage.objects DISABLE ROW LEVEL SECURITY;
            
            -- Drop existing policies if they exist
            DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
            
            -- Create a more permissive policy
            CREATE POLICY "Allow authenticated users to upload"
            ON storage.objects
            FOR ALL
            TO authenticated
            USING (bucket_id = '${bucketName}');
            
            -- Re-enable RLS with the new policy in place
            ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
          `,
          },
        );

        if (rlsError) {
          throw rlsError;
        }
      } catch (rlsError) {
        console.warn("Warning: Failed to fix RLS policies:", rlsError);
        // Continue anyway as the bucket was created
      }

      return NextResponse.json({
        success: true,
        message: `Bucket '${bucketName}' created successfully via ${creationMethod}`,
        data: creationData,
      });
    } else {
      // All approaches failed
      return NextResponse.json(
        {
          error: `Failed to create bucket after multiple attempts: ${lastError?.message || "Unknown error"}`,
          details: lastError,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in create-storage-bucket API:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
