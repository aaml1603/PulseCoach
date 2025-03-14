import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Stripe API key is available
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("No Stripe API key found, returning fallback plans");
      // Return fallback plans if no Stripe key is available
      const fallbackPlans = [
        {
          id: "price_monthly",
          name: "Coach Pro Plan",
          amount: 2000, // $20.00
          interval: "month",
          currency: "usd",
          metadata: {},
          productId: "prod_default_monthly",
        },
        {
          id: "price_yearly",
          name: "Coach Pro Plan",
          amount: 19200, // $192.00
          interval: "year",
          currency: "usd",
          metadata: {},
          productId: "prod_default_yearly",
        },
      ];

      return new Response(JSON.stringify(fallbackPlans), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Stripe with the API key
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Log the key type to verify we're using the live key
    console.log(
      "Using key type:",
      stripeKey.startsWith("sk_live") ? "live" : "test",
    );

    // Get all active prices with expanded product data
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
      limit: 100,
    });

    // Filter out prices that don't have recurring intervals
    const validPrices = prices.data.filter(
      (price) => price.recurring && price.recurring.interval,
    );

    // Format the data for our frontend
    const plans = validPrices.map((price) => ({
      id: price.id,
      name: price.product.name,
      amount: price.unit_amount,
      interval: price.recurring?.interval,
      currency: price.currency,
      metadata: price.metadata,
      productId: price.product.id,
    }));

    // Log the plans for debugging
    console.log(`Found ${plans.length} valid pricing plans`);
    plans.forEach((plan) => {
      console.log(
        `Plan: ${plan.name}, Interval: ${plan.interval}, Amount: ${plan.amount}`,
      );
    });

    // If no plans were found from Stripe, return fallback plans
    if (plans.length === 0) {
      console.log("No plans found from Stripe, returning fallback plans");
      const fallbackPlans = [
        {
          id: "price_monthly",
          name: "Coach Pro Plan",
          amount: 2000, // $20.00
          interval: "month",
          currency: "usd",
          metadata: {},
          productId: "prod_default_monthly",
        },
        {
          id: "price_yearly",
          name: "Coach Pro Plan",
          amount: 19200, // $192.00
          interval: "year",
          currency: "usd",
          metadata: {},
          productId: "prod_default_yearly",
        },
      ];
      return new Response(JSON.stringify(fallbackPlans), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify(plans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting pricing plans:", error);

    // Return fallback plans in case of any error
    const fallbackPlans = [
      {
        id: "price_monthly",
        name: "Coach Pro Plan",
        amount: 2000, // $20.00
        interval: "month",
        currency: "usd",
        metadata: {},
        productId: "prod_default_monthly",
      },
      {
        id: "price_yearly",
        name: "Coach Pro Plan",
        amount: 19200, // $192.00
        interval: "year",
        currency: "usd",
        metadata: {},
        productId: "prod_default_yearly",
      },
    ];

    return new Response(JSON.stringify(fallbackPlans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
