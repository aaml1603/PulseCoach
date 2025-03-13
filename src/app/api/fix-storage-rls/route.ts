import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Execute SQL to fix RLS policies
    const { data, error } = await supabase.rpc("exec_sql", {
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
        USING (true);
        
        -- Re-enable RLS with the new policy in place
        ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;
        
        -- Also fix progress_pictures table RLS
        ALTER TABLE IF EXISTS progress_pictures DISABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON progress_pictures;
        
        -- Create a more permissive policy
        CREATE POLICY "Allow all operations for authenticated users"
        ON progress_pictures
        FOR ALL
        TO authenticated
        USING (true);
        
        -- Re-enable RLS with the new policy in place
        ALTER TABLE IF EXISTS progress_pictures ENABLE ROW LEVEL SECURITY;
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: `Failed to fix storage RLS: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Storage RLS policies fixed successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
