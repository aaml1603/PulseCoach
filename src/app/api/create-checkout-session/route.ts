import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, returnUrl } = await request.json();

    if (!priceId || !userId || !returnUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Call the Supabase Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        price_id: priceId,
        user_id: userId,
        return_url: returnUrl,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
