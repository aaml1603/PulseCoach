import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Getting Started - PulseCoach Help",
  description:
    "Learn how to get started with PulseCoach and set up your fitness coaching business.",
};

export default async function GettingStartedHelpPage() {
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
              <h1 className="text-3xl font-bold">
                Getting Started with PulseCoach
              </h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Your First Steps</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    1. Setting Up Your Account
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    After signing up for PulseCoach, here's how to set up your
                    account:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>
                      Complete your coach profile with your name, credentials,
                      and specialties
                    </li>
                    <li>Upload a professional profile picture</li>
                    <li>Set your notification preferences</li>
                    <li>Customize your dashboard layout</li>
                    <li>Review and accept the terms of service</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    2. Adding Your First Client
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To add your first client to PulseCoach:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Click "Add New Client"</li>
                    <li>
                      Enter the client's basic information (name, email, etc.)
                    </li>
                    <li>Add any initial metrics (weight, height, etc.)</li>
                    <li>Set their fitness goals</li>
                    <li>Click "Save Client"</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Once added, you can generate a client portal link to share
                    with them.
                  </p>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    3. Creating Your First Workout
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To create your first workout plan:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Workouts</li>
                    <li>Click "Create New Workout"</li>
                    <li>Name your workout and add a description</li>
                    <li>Click "Add Exercise" to browse the exercise library</li>
                    <li>
                      Select exercises and configure sets, reps, and rest
                      periods
                    </li>
                    <li>Arrange exercises in the desired order</li>
                    <li>Click "Save Workout"</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    4. Assigning a Workout to a Client
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To assign your newly created workout to a client:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Workouts" tab</li>
                    <li>Click "Assign Workout"</li>
                    <li>Select the workout from your library</li>
                    <li>Set a due date (optional)</li>
                    <li>Add notes for the client (optional)</li>
                    <li>Click "Assign Workout"</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    5. Tracking Client Progress
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To start tracking your client's progress:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Select the client</li>
                    <li>Click on the "Metrics" tab</li>
                    <li>Click "Add New Metrics"</li>
                    <li>Enter initial measurements and metrics</li>
                    <li>Upload progress pictures (optional)</li>
                    <li>Set goals based on these initial metrics</li>
                  </ol>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    6. Exploring Advanced Features
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Once you're comfortable with the basics, explore these
                    advanced features:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Client Portal:</strong> Set up personalized
                      portals for your clients
                    </li>
                    <li>
                      <strong>Messaging:</strong> Communicate directly with
                      clients through the platform
                    </li>
                    <li>
                      <strong>Analytics:</strong> View detailed reports on
                      client progress and engagement
                    </li>
                    <li>
                      <strong>Exercise Library:</strong> Create custom exercises
                      specific to your coaching style
                    </li>
                    <li>
                      <strong>Notifications:</strong> Configure automated alerts
                      for important events
                    </li>
                    <li>
                      <strong>Templates:</strong> Create workout templates to
                      save time
                    </li>
                  </ul>
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
