"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
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
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

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

  const formatAmount = (amount: number) => {
    if (!amount) return "$0";
    return `$${(amount / 100).toFixed(2)}`;
  };

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        return;
      }

      // Call the customer portal function
      const { data, error } = await supabase.functions.invoke(
        "create-customer-portal",
        {
          body: { customer_id: subscription.customer_id },
        },
      );

      if (error) {
        throw error;
      }

      if (data?.url) {
        setPortalUrl(data.url);
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Error creating customer portal:", err);
      setError("Failed to open customer portal");
    } finally {
      setManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        </div>

        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse h-4 w-32 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Your current plan information</CardDescription>
              </div>
              {subscription && (
                <Badge
                  variant={
                    subscription.status === "active" ? "default" : "outline"
                  }
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
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                    <h4 className="font-medium mb-1">Subscription Ending</h4>
                    <p>
                      Your subscription will end on{" "}
                      {formatDate(subscription.current_period_end)}. After this
                      date, you will lose access to premium features.
                    </p>
                  </div>
                )}

                {subscription.status === "past_due" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                    <h4 className="font-medium mb-1">Payment Issue</h4>
                    <p>
                      There was a problem with your last payment. Please update
                      your payment method to avoid service interruption.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {subscription && (
            <CardFooter>
              <div className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                >
                  {managingSubscription ? (
                    "Opening Portal..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Manage Billing
                    </>
                  )}
                </Button>
                {portalUrl && (
                  <div className="mt-2 text-center">
                    <Link
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
                    >
                      Open billing portal{" "}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payments and invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                Payment history is available in the Stripe customer portal
              </p>
              {subscription && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                >
                  View Payment History
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
