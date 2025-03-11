"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PricingButtonProps {
  priceId: string;
  userId?: string;
  isLoggedIn: boolean;
}

export default function PricingButton({
  priceId,
  userId,
  isLoggedIn,
}: PricingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      setIsLoading(true);

      // Use the API route instead of directly calling the function
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId,
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
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

  return (
    <Button
      className="w-full mt-8 py-6 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Get Started"}
    </Button>
  );
}
