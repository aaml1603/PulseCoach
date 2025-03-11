import DashboardNavbar from "@/components/dashboard-navbar";
import FeedbackTab from "@/components/feedback-tab";
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

  // If no subscription, redirect to pricing page
  if (!hasSubscription) {
    return redirect("/pricing?access=denied");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <FeedbackTab />
    </div>
  );
}
