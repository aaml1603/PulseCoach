import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, LineChart } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Progress Tracking Help - PulseCoach",
  description:
    "Learn how to track and analyze client progress using PulseCoach's progress tracking features.",
};

export default async function ProgressTrackingHelpPage() {
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
              <h1 className="text-3xl font-bold">Progress Tracking Help</h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Tracking Client Progress</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I record client metrics?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To record client metrics such as weight, measurements, or
                    body fat percentage:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client you want to update</li>
                    <li>Click on the "Metrics" tab</li>
                    <li>Click "Add New Metrics"</li>
                    <li>
                      Enter the date and values for the metrics you want to
                      record
                    </li>
                    <li>Add notes if needed</li>
                    <li>Click "Save Metrics"</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I upload progress pictures?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To upload and manage client progress pictures:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Pictures" tab</li>
                    <li>Click "Upload Progress Picture"</li>
                    <li>Select an image file from your device (max 5MB)</li>
                    <li>Add notes about the picture if needed</li>
                    <li>Click "Upload Picture"</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: All progress pictures are stored securely and are only
                    visible to you and the client.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I view progress charts?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To view and analyze client progress charts:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Metrics" tab</li>
                    <li>
                      You'll see charts for all recorded metrics (weight,
                      measurements, etc.)
                    </li>
                    <li>
                      Use the date range selector to adjust the time period
                    </li>
                    <li>Hover over data points to see specific values</li>
                    <li>
                      Toggle between different metrics using the chart controls
                    </li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I set goals for clients?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To set and track goals for your clients:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Goals" tab</li>
                    <li>Click "Add New Goal"</li>
                    <li>Enter a title and description for the goal</li>
                    <li>Select the metric type (weight, measurements, etc.)</li>
                    <li>Set the current value and target value</li>
                    <li>Set a target date</li>
                    <li>Click "Save Goal"</li>
                  </ol>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I compare before/after pictures?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To compare client progress pictures side by side:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Pictures" tab</li>
                    <li>Click "Compare Pictures"</li>
                    <li>Select the "before" picture from the left panel</li>
                    <li>Select the "after" picture from the right panel</li>
                    <li>
                      Use the slider to see the difference between the two
                      pictures
                    </li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    This visual comparison is a powerful way to show clients
                    their progress over time.
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
