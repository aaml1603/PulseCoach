"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CoachSubscriptionManagement() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

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
        if (data?.customer_id) {
          setCustomerId(data.customer_id);
        }
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

  const formatAmount = (amount: number) => {
    if (!amount) return "$0";
    return `$${(amount / 100).toFixed(2)}`;
  };

  const handleOpenPortal = async () => {
    if (!customerId) {
      console.error("No customer ID provided");
      return;
    }

    try {
      setManagingSubscription(true);

      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/dashboard/settings`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      // Redirect to Stripe Customer Portal
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert(
        "There was an error opening the customer portal. Please try again later.",
      );
    } finally {
      setManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse h-4 w-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Your current plan information</CardDescription>
          </div>
          {subscription && (
            <Badge
              variant={subscription.status === "active" ? "default" : "outline"}
            >
              {subscription.status === "active"
                ? "Active"
                : subscription.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!subscription ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You don't have an active subscription
            </p>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Plan
                  </h3>
                  <p className="font-medium">Coach Pro Plan</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Amount
                  </h3>
                  <p className="font-medium">
                    {formatAmount(subscription.amount)} /{" "}
                    {subscription.interval}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <p className="font-medium capitalize">
                    {subscription.status}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Current Period
                  </h3>
                  <p className="font-medium">
                    {formatDate(subscription.current_period_start)} -{" "}
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Subscription ID
                  </h3>
                  <p className="font-medium text-sm font-mono">
                    {subscription.stripe_id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created
                  </h3>
                  <p className="font-medium">
                    {new Date(subscription.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {subscription.cancel_at_period_end && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-200">
                <h4 className="font-medium mb-1">Subscription Ending</h4>
                <p>
                  Your subscription will end on{" "}
                  {formatDate(subscription.current_period_end)}. After this
                  date, you will lose access to premium features.
                </p>
              </div>
            )}

            {subscription.status === "past_due" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-200">
                <h4 className="font-medium mb-1">Payment Issue</h4>
                <p>
                  There was a problem with your last payment. Please update your
                  payment method to avoid service interruption.
                </p>
              </div>
            )}

            {subscription.status === "trialing" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Trial Period</h4>
                    <p>
                      Your trial ends on{" "}
                      {formatDate(subscription.current_period_end)}. You'll be
                      automatically subscribed to the plan after the trial ends.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {subscription && (
        <CardFooter>
          <div className="w-full">
            {customerId ? (
              <Button
                onClick={handleOpenPortal}
                className="w-full"
                disabled={managingSubscription}
              >
                {managingSubscription ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Manage Subscription
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/pricing")}
              >
                <CreditCard className="mr-2 h-4 w-4" /> View Plans
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
