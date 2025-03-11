import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Dumbbell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { WorkoutCard } from "@/components/ui/workout-card";

export default async function WorkoutsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch workouts for the logged-in coach (only general workouts, not client-specific ones)
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("coach_id", user?.id)
    .eq("client_specific", false)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Workout Plans</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/workouts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Workout
          </Link>
        </Button>
      </div>

      {workouts && workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => {
            // Generate random exercise count and duration for demo purposes
            const exerciseCount = Math.floor(Math.random() * 10) + 3;
            const duration = (Math.floor(Math.random() * 6) + 3) * 10;
            const difficultyOptions = ["beginner", "intermediate", "advanced"];
            const difficulty = difficultyOptions[
              Math.floor(Math.random() * 3)
            ] as "beginner" | "intermediate" | "advanced";

            return (
              <Link
                href={`/dashboard/workouts/${workout.id}`}
                className="block"
                key={workout.id}
              >
                <WorkoutCard
                  id={workout.id}
                  name={workout.name}
                  description={workout.description}
                  exerciseCount={exerciseCount}
                  duration={duration}
                  difficulty={difficulty}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No workout plans yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first workout plan.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/workouts/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Workout
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
