"use client";

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
import { createClient } from "../../supabase/client";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
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

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto relative overflow-hidden border border-primary/20 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="relative text-center pb-2">
        <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-fit mx-auto mb-4">
          Recommended Plan
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-4 justify-center">
          <span className="text-5xl font-bold text-gray-900">
            ${item?.amount / 100}
          </span>
          <span className="text-gray-600 text-xl">/{item?.interval}</span>
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
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-8">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className="w-full py-6 text-lg font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-colors"
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
