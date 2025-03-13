import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Attempting to create storage schema and tables");
    const supabase = await createClient();

    // Execute SQL to create storage schema and tables
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Create storage schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS storage;

        -- Create storage.buckets table if it doesn't exist
        CREATE TABLE IF NOT EXISTS storage.buckets (
          id TEXT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          owner UUID,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          public BOOLEAN DEFAULT FALSE
        );

        -- Create storage.objects table if it doesn't exist
        CREATE TABLE IF NOT EXISTS storage.objects (
          id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
          bucket_id TEXT NOT NULL REFERENCES storage.buckets(id),
          name TEXT NOT NULL,
          owner UUID,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
          metadata JSONB,
          path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
          UNIQUE (bucket_id, name)
        );

        -- Create storage.policies table if it doesn't exist
        CREATE TABLE IF NOT EXISTS storage.policies (
          id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          bucket_id TEXT NOT NULL REFERENCES storage.buckets(id),
          operation TEXT NOT NULL,
          definition JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (bucket_id, name)
        );
      `,
    });

    if (error) {
      console.error("Error creating storage schema:", error);
      return NextResponse.json(
        { error: `Failed to create storage schema: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Storage schema and tables created successfully",
    });
  } catch (error: any) {
    console.error("Error in create-storage-schema API:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
