import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { bucketName = "progress-pictures" } = await request.json();

    console.log(`Attempting to create bucket directly: ${bucketName}`);
    const supabase = await createClient();

    // Try to create the bucket using the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "create_storage_bucket",
      { bucket_name: bucketName, is_public: true },
    );

    if (rpcError) {
      console.error(`RPC bucket creation failed: ${rpcError.message}`);

      // Try using the edge function as a fallback
      try {
        const { data: edgeData, error: edgeError } =
          await supabase.functions.invoke("create_storage_bucket_rpc", {});

        if (edgeError) {
          return NextResponse.json(
            {
              error: `Edge function failed: ${edgeError.message}`,
              fallbackAttempted: true,
            },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message: "Bucket created via edge function",
          data: edgeData,
        });
      } catch (edgeErr: any) {
        return NextResponse.json(
          {
            error: `All creation methods failed: ${edgeErr.message}`,
            rpcError: rpcError.message,
          },
          { status: 500 },
        );
      }
    }

    // Verify the bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      return NextResponse.json(
        { error: `Failed to verify bucket: ${listError.message}` },
        { status: 500 },
      );
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    return NextResponse.json({
      success: true,
      message: bucketExists
        ? `Bucket '${bucketName}' created or already exists`
        : `RPC function executed but bucket verification failed`,
      bucketExists,
    });
  } catch (error: any) {
    console.error("Error in create-bucket-direct API:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
