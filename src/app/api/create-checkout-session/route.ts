import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Get user email for the checkout session
    const { data: userData } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    // Create a direct Stripe checkout session instead of using Edge Function
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

    // Get available prices from your Stripe account
    const prices = await stripe.prices.list({
      active: true,
      limit: 10,
    });

    // Remove console.log for production

    // Create Stripe checkout session using your existing product
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // Use the first available price from your Stripe account
          price: prices.data[0]?.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      customer_email: userData?.email,
      metadata: {
        user_id: userId,
      },
    });

    const data = { sessionId: session.id, url: session.url };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
