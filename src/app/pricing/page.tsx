import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Footer from "@/components/footer";

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

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

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

        <div className="flex justify-center">
          {plans?.map((item: any) => (
            <PricingCard key={item.id} item={item} user={user} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
