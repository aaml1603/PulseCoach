import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Dumbbell } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Workout Builder Help - PulseCoach",
  description:
    "Learn how to create and manage workout plans for your clients using PulseCoach's workout builder.",
};

export default async function WorkoutBuilderHelpPage() {
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
              <h1 className="text-3xl font-bold">Workout Builder Help</h1>
            </div>

            <div className="bg-card border border-border/40 rounded-xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">
                  Creating and Managing Workouts
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I create a new workout plan?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To create a new workout plan in PulseCoach:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to your Dashboard</li>
                    <li>Click on "Workouts" in the navigation menu</li>
                    <li>Click the "Create New Workout" button</li>
                    <li>Enter a name and description for your workout</li>
                    <li>Click "Create Workout"</li>
                    <li>
                      You'll be taken to the workout editor where you can add
                      exercises
                    </li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I add exercises to a workout?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To add exercises to your workout plan:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Open the workout you want to edit</li>
                    <li>Click "Add Exercise"</li>
                    <li>
                      Browse or search for exercises in our exercise library
                    </li>
                    <li>Click on an exercise to add it to your workout</li>
                    <li>
                      Configure the sets, reps, and rest time for the exercise
                    </li>
                    <li>Add notes if needed</li>
                    <li>Click "Save" to add the exercise to your workout</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I edit or remove exercises from a workout?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To edit or remove exercises:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Edit:</strong> Click on the exercise in your
                      workout, make your changes, and click "Save Changes"
                    </li>
                    <li>
                      <strong>Remove:</strong> Click on the exercise and then
                      click the "Remove Exercise" button
                    </li>
                    <li>
                      <strong>Reorder:</strong> Drag and drop exercises to
                      change their order in the workout
                    </li>
                  </ul>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I assign a workout to a client?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To assign a workout to a client:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>Click on the client you want to assign a workout to</li>
                    <li>Click on the "Workouts" tab</li>
                    <li>Click "Assign Workout"</li>
                    <li>Select a workout from your library</li>
                    <li>Set a due date (optional)</li>
                    <li>Add notes for the client (optional)</li>
                    <li>Click "Assign Workout"</li>
                  </ol>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Can I create a personalized workout for a specific client?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Yes, you can create client-specific workouts:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Clients</li>
                    <li>
                      Click on the client you want to create a workout for
                    </li>
                    <li>Click on the "Workouts" tab</li>
                    <li>Click "Create Personalized Workout"</li>
                    <li>Fill out the workout details</li>
                    <li>Add exercises specific to this client's needs</li>
                    <li>Click "Save & Assign"</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: Client-specific workouts will only appear in that
                    client's workout list and won't be added to your general
                    workout library.
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I duplicate a workout?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    To duplicate an existing workout:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                    <li>Go to Dashboard → Workouts</li>
                    <li>Find the workout you want to duplicate</li>
                    <li>Click on the three dots (⋮) menu</li>
                    <li>Select "Duplicate"</li>
                    <li>Edit the name and description if needed</li>
                    <li>Click "Create Duplicate"</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    This creates an exact copy of the workout that you can then
                    modify as needed without affecting the original.
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
