"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          return;
        }

        // Fetch subscription data
        const { data, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (subError && subError.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          setError("Error fetching subscription");
          return;
        }

        setSubscription(data);
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setError("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-2">
        <div className="h-4 w-24 bg-muted rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span>Error loading subscription</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-200 bg-amber-50"
          >
            No Active Subscription
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          You don't have an active subscription. View our pricing plans to
          subscribe.
        </p>
      </div>
    );
  }

  // Check if user is on a free trial
  const isTrial = subscription.status === "trialing";
  const isActive = subscription.status === "active";
  const isPastDue = subscription.status === "past_due";
  const isCancelled = subscription.cancel_at_period_end;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        {isTrial && (
          <Badge
            variant="outline"
            className="text-blue-500 border-blue-200 bg-blue-50"
          >
            Free Trial
          </Badge>
        )}
        {isActive && !isCancelled && (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )}
        {isActive && isCancelled && (
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-200 bg-amber-50"
          >
            Cancelling
          </Badge>
        )}
        {isPastDue && (
          <Badge
            variant="outline"
            className="text-red-500 border-red-200 bg-red-50"
          >
            Payment Issue
          </Badge>
        )}
      </div>

      <div className="text-sm">
        {isTrial && (
          <div className="flex items-center space-x-1 text-blue-600">
            <Clock className="h-4 w-4" />
            <span>
              Trial ends on {formatDate(subscription.current_period_end)}
            </span>
          </div>
        )}

        {isActive && !isCancelled && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Renews on {formatDate(subscription.current_period_end)}</span>
          </div>
        )}

        {isActive && isCancelled && (
          <div className="flex items-center space-x-1 text-amber-600">
            <Clock className="h-4 w-4" />
            <span>Ends on {formatDate(subscription.current_period_end)}</span>
          </div>
        )}

        {isPastDue && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Please update your payment method</span>
          </div>
        )}
      </div>
    </div>
  );
}
