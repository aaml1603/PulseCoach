import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Account & Billing Help - PulseCoach",
  description:
    "Get help with your PulseCoach account, subscription, and billing questions.",
};

export default async function AccountBillingHelpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/help">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Account & Billing Help</h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I update my billing information?
                  </h3>
                  <p className="text-muted-foreground">
                    You can update your billing information by going to
                    Dashboard → Billing. From there, click on "Update Payment
                    Method" to add or change your payment details.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I cancel my subscription?
                  </h3>
                  <p className="text-muted-foreground">
                    To cancel your subscription, go to Dashboard → Billing and
                    click on "Cancel Subscription". Your subscription will
                    remain active until the end of your current billing period.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Can I get a refund?
                  </h3>
                  <p className="text-muted-foreground">
                    We offer refunds within 14 days of purchase if you're not
                    satisfied with our service. Please contact our support team
                    to process your refund request.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I change my email address?
                  </h3>
                  <p className="text-muted-foreground">
                    You can change your email address by going to Dashboard →
                    Profile. Click on "Edit Profile" and update your email
                    address. You'll need to verify your new email address before
                    the change takes effect.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I reset my password?
                  </h3>
                  <p className="text-muted-foreground">
                    If you're logged in, go to Dashboard → Profile → Change
                    Password. If you're logged out, click on "Forgot Password"
                    on the sign-in page and follow the instructions sent to your
                    email.
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, Mastercard, American
                    Express, Discover) through our secure payment processor,
                    Stripe.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 shadow-sm text-center">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                <Mail className="h-6 w-6 text-primary" /> Still Need Help?
              </h2>
              <p className="text-lg mb-4">
                If you couldn't find the answer to your question, our support
                team is here to help.
              </p>
              <Button asChild size="lg">
                <Link href="/help">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
