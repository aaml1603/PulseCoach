import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Footer from "@/components/footer";
import PricingButton from "@/components/pricing-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Pricing - PulseCoach",
  description:
    "Simple, transparent pricing for fitness coaches. Choose the perfect plan for your coaching business with no hidden fees.",
  keywords:
    "fitness coach pricing, personal trainer software pricing, workout management pricing",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { access?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all plans from Stripe
  let allPlans = [];
  try {
    const { data, error } = await supabase.functions.invoke("get-plans");
    if (data && Array.isArray(data) && data.length > 0) {
      allPlans = data;
    } else {
      // Fallback plans if the function fails or returns empty
      allPlans = [
        {
          id: "price_monthly",
          name: "Coach Pro Plan",
          amount: 2000, // $20.00
          interval: "month",
          currency: "usd",
        },
        {
          id: "price_yearly",
          name: "Coach Pro Plan",
          amount: 19200, // $192.00
          interval: "year",
          currency: "usd",
        },
      ];
    }
  } catch (e) {
    console.error("Error fetching plans:", e);
    // Fallback plans if the function throws an error
    allPlans = [
      {
        id: "price_monthly",
        name: "Coach Pro Plan",
        amount: 2000,
        interval: "month",
        currency: "usd",
      },
      {
        id: "price_yearly",
        name: "Coach Pro Plan",
        amount: 19200,
        interval: "year",
        currency: "usd",
      },
    ];
  }

  // Separate plans by interval (monthly and yearly)
  const monthlyPlan = allPlans.find((plan: any) => plan.interval === "month");
  const yearlyPlan = allPlans.find((plan: any) => plan.interval === "year");

  // Check if user was redirected due to missing subscription or trial expiration
  const accessDenied = searchParams.access === "denied";
  const trialExpired = searchParams.access === "trial_expired";

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {accessDenied && (
          <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Required</AlertTitle>
            <AlertDescription>
              You need an active subscription to access the dashboard. Please
              subscribe to a plan below.
            </AlertDescription>
          </Alert>
        )}

        {trialExpired && (
          <Alert
            variant="warning"
            className="mb-8 max-w-3xl mx-auto bg-orange-50 border-orange-200 text-orange-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Free Trial Expired</AlertTitle>
            <AlertDescription>
              Your 7-day free trial has ended. Subscribe now to continue using
              all features.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Pricing cards section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {monthlyPlan && (
            <PricingCard key={monthlyPlan.id} item={monthlyPlan} user={user} />
          )}
          {yearlyPlan && (
            <PricingCard key={yearlyPlan.id} item={yearlyPlan} user={user} />
          )}
        </div>

        {/* CTA Section */}
        <section className="py-20 bg-muted/20 border-t border-border/40 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Coaching Business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of fitness professionals who are growing their
              business and delivering better results to clients. Start your
              7-day free trial today!
            </p>
            <Button size="lg" className="text-lg" asChild>
              <Link href="/sign-up">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
