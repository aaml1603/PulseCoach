import { createClient } from "../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Dumbbell, Edit } from "lucide-react";
import Link from "next/link";

// No formatting function needed

export default async function WorkoutDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch workout details
  const { data: workout, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", params.id)
    .eq("coach_id", user.id)
    .single();

  if (error || !workout) {
    return notFound();
  }

  // Fetch exercises for this workout
  const { data: workoutExercises } = await supabase
    .from("workout_exercises")
    .select(
      `
      *,
      exercise:exercises(*)
    `,
    )
    .eq("workout_id", params.id)
    .order("order_index");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/workouts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/workouts/${params.id}/exercises/add`}>
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Description</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/workouts/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {workout.description ? (
            <p className="whitespace-pre-wrap">{workout.description}</p>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided. Add details about this workout plan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {workoutExercises && workoutExercises.length > 0 ? (
            <div className="space-y-4">
              {workoutExercises.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-shrink-0 bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <span className="font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">
                      {item.exercise.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Sets:</span> {item.sets}
                      </div>
                      <div>
                        <span className="text-gray-500">Reps:</span> {item.reps}
                      </div>
                      <div>
                        <span className="text-gray-500">Rest:</span>{" "}
                        {item.rest_time}s
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="text-gray-500">Notes:</span>{" "}
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No exercises added yet</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Start building your workout by adding exercises.
              </p>
              <Button asChild>
                <Link href={`/dashboard/workouts/${params.id}/exercises/add`}>
                  Add First Exercise
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
