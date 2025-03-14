import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Request Submitted - PulseCoach Help Center",
  description:
    "Your help request has been successfully submitted to the PulseCoach support team.",
};

export default async function HelpSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">Request Submitted</h1>

              <p className="text-lg text-muted-foreground mb-6">
                Thank you for contacting the PulseCoach support team. We've
                received your request and will get back to you as soon as
                possible.
              </p>

              <p className="text-muted-foreground mb-8">
                A confirmation email has been sent to your email address with
                the details of your request.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/help">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Help Center
                  </Link>
                </Button>

                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
