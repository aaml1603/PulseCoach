"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../../../../../supabase/client";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function AddExercisePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [sets, setSets] = useState<string>("3");
  const [reps, setReps] = useState<string>("10");
  const [restTime, setRestTime] = useState<string>("60");
  const [notes, setNotes] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch workout data
      const { data: workout } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (workout) {
        setWorkoutData(workout);
      }

      // Fetch all exercises
      const { data: exercisesData } = await supabase
        .from("exercises")
        .select("*")
        .order("name");

      if (exercisesData) {
        setExercises(exercisesData);
        setFilteredExercises(exercisesData);
      }

      // Get the count of existing exercises to determine order_index
      const { count } = await supabase
        .from("workout_exercises")
        .select("*", { count: "exact" })
        .eq("workout_id", params.id);
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Group exercises by muscle group
      const groupedExercises = [...exercises].sort((a, b) => {
        // First sort by muscle group
        if (a.muscle_group && b.muscle_group) {
          return a.muscle_group.localeCompare(b.muscle_group);
        }
        // If one has muscle group and other doesn't, prioritize the one with muscle group
        if (a.muscle_group && !b.muscle_group) return -1;
        if (!a.muscle_group && b.muscle_group) return 1;
        // If neither has muscle group, sort by name
        return a.name.localeCompare(b.name);
      });
      setFilteredExercises(groupedExercises);
    } else {
      const filtered = exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exercise.muscle_group &&
            exercise.muscle_group
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (exercise.equipment &&
            exercise.equipment
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedExercise) {
      setError("Please select an exercise");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Get the count of existing exercises to determine order_index
      const { count, error: countError } = await supabase
        .from("workout_exercises")
        .select("*", { count: "exact" })
        .eq("workout_id", params.id);

      if (countError) {
        throw countError;
      }

      // Insert the exercise into the workout
      const { data, error: insertError } = await supabase
        .from("workout_exercises")
        .insert({
          workout_id: params.id,
          exercise_id: selectedExercise,
          sets: parseInt(sets),
          reps: parseInt(reps),
          rest_time: parseInt(restTime),
          notes: notes || null,
          order_index: (count || 0) + 1,
        });

      if (insertError) {
        throw insertError;
      }

      // Redirect to the workout details page
      router.push(`/dashboard/workouts/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to add exercise");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/workouts/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Add Exercise</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/exercises/new">Create Custom Exercise</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Add Exercise to {workoutData?.name || "Workout"}
          </CardTitle>
          <CardDescription>
            Select an exercise and configure sets, reps, and rest time
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="search">Search Exercises</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, muscle group, or equipment"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Select Exercise *</Label>
              <Select
                value={selectedExercise}
                onValueChange={setSelectedExercise}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an exercise" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {/* Group exercises by muscle group */}
                  {(() => {
                    const muscleGroups: Record<string, any[]> = {};

                    // Group exercises by muscle group
                    filteredExercises.forEach((exercise) => {
                      const group = exercise.muscle_group || "Other";
                      if (!muscleGroups[group]) {
                        muscleGroups[group] = [];
                      }
                      muscleGroups[group].push(exercise);
                    });

                    // Sort muscle groups alphabetically
                    const sortedGroups = Object.keys(muscleGroups).sort();

                    // Return grouped SelectItems
                    return sortedGroups.map((group) => (
                      <div key={group}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                          {group}
                        </div>
                        {muscleGroups[group].map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                            {exercise.name}
                            {exercise.equipment
                              ? ` (${exercise.equipment})`
                              : ""}
                          </SelectItem>
                        ))}
                      </div>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restTime">Rest Time (seconds)</Label>
                <Input
                  id="restTime"
                  type="number"
                  min="0"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions for this exercise"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/workouts/${params.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedExercise}>
              {isLoading ? "Adding..." : "Add Exercise"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
