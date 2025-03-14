"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CheckCircle2 } from "lucide-react";

interface PricingItem {
  id: string;
  name: string;
  amount: number;
  interval: string;
  currency: string;
  metadata?: Record<string, any>;
}

export default function PricingCard({
  item,
  user,
}: {
  item: PricingItem;
  user: User | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Creating checkout session for price: ${priceId}`);

      // Use the API route instead of directly calling the function
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response from checkout API:", data);
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL in checkout response:", data);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(
        "There was an error processing your request. Please try again later.",
      );
      setIsLoading(false);
    }
  };

  // Format the price display based on interval
  const formatPrice = () => {
    const amount = item?.amount / 100;
    if (item?.interval === "year") {
      return (
        <>
          <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            ${amount}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-xl">
            /year
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            ${amount}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-xl">
            /{item?.interval}
          </span>
        </>
      );
    }
  };

  // Get the appropriate badge text based on interval
  const getBadgeText = () => {
    if (item?.interval === "year") {
      return "Best Value";
    } else {
      return "Most Popular";
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto relative overflow-hidden border border-primary/20 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="relative text-center pb-2">
        <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-fit mx-auto mb-4">
          {getBadgeText()}
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-4 justify-center">
          {formatPrice()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Unlimited clients</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Priority support</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Custom workout builder</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Client portal access</span>
          </div>
          {item?.interval === "year" && (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium text-primary">
                Save 16% compared to monthly
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-8">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className="w-full py-6 text-lg font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}
