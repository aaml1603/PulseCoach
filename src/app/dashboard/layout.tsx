import DashboardNavbar from "@/components/dashboard-navbar";

import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user has an active subscription
  const hasSubscription = await checkUserSubscription(user.id);

  // Check if user has an active trial
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("trial_start_date, trial_end_date")
    .eq("id", user.id)
    .single();

  // If no subscription, check if trial is still valid
  if (!hasSubscription) {
    // If user has trial data and trial end date is in the future, allow access
    if (userData?.trial_end_date) {
      const trialEndDate = new Date(userData.trial_end_date);
      const now = new Date();

      if (trialEndDate <= now) {
        // Trial has expired, redirect to pricing
        return redirect("/pricing?access=trial_expired");
      }
    } else {
      // No subscription and no trial, redirect to pricing
      return redirect("/pricing?access=denied");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
