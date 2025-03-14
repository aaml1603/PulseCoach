import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
    });

    // Get all active prices from Stripe
    let actualPriceId = "";

    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ["data.product"],
        limit: 100,
      });

      // Find the correct price based on the logical ID
      if (priceId === "price_monthly") {
        // Find the monthly price (filter by interval)
        const monthlyPrice = prices.data.find(
          (price) => price.recurring?.interval === "month",
        );
        if (monthlyPrice) {
          actualPriceId = monthlyPrice.id;
        }
      } else if (priceId === "price_yearly") {
        // Find the yearly price (filter by interval)
        const yearlyPrice = prices.data.find(
          (price) => price.recurring?.interval === "year",
        );
        if (yearlyPrice) {
          actualPriceId = yearlyPrice.id;
        }
      } else {
        // If it's already a Stripe price ID, use it directly
        actualPriceId = priceId;
      }
    } catch (error) {
      console.error("Error fetching prices from Stripe:", error);
      // If there's an error fetching prices, use the priceId directly
      actualPriceId = priceId;
    }

    if (!actualPriceId) {
      return NextResponse.json(
        { error: `No active price found for ${priceId}` },
        { status: 400 },
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: actualPriceId,
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
