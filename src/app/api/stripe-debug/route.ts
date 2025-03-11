import { NextRequest, NextResponse } from "next/server";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const envVars = {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_PUBLISHABLE_KEY,
      keyType: STRIPE_PUBLISHABLE_KEY?.startsWith("pk_live") ? "live" : "test",
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json(envVars);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
