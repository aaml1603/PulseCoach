"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createClient } from "../../supabase/client";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

export default function PricingCardDebug({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);

  // Handle checkout process with debugging
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    setLoading(true);
    setError(null);
    setDebug(null);

    try {
      // Log the key being used
      setDebug({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        keyType: STRIPE_PUBLISHABLE_KEY.startsWith("pk_live") ? "live" : "test",
        priceId,
        userId: user.id,
      });

      const { data, error } = await createClient().functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Update debug info with response
      setDebug((prev) => ({ ...prev, response: data }));

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setError(error.message || "Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`w-[350px] relative overflow-hidden ${item.popular ? "border-2 border-blue-500 shadow-xl scale-105" : "border border-gray-200"}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-gray-900">
            ${item?.amount / 100}
          </span>
          <span className="text-gray-600">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="relative flex flex-col gap-4">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Started"}
        </Button>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {debug && (
          <div className="text-xs text-left bg-gray-50 p-2 rounded overflow-auto max-h-40">
            <div>
              <strong>Key Type:</strong> {debug.keyType}
            </div>
            <div>
              <strong>Key:</strong> {debug.publishableKey.substring(0, 10)}...
              {debug.publishableKey.substring(debug.publishableKey.length - 4)}
            </div>
            <div>
              <strong>Price ID:</strong> {debug.priceId}
            </div>
            {debug.response && (
              <div>
                <strong>Response:</strong> {JSON.stringify(debug.response)}
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
