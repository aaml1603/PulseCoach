"use client";

import { useState } from "react";
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
import { createClient } from "../../../../../supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewExercisePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const instructions = formData.get("instructions") as string;
    const description = formData.get("description") as string;

    if (!name) {
      setError("Exercise name is required");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to create an exercise");
      }

      // Insert the new exercise
      const { data, error: insertError } = await supabase
        .from("exercises")
        .insert({
          name,
          muscle_group: muscleGroup || null,
          category: category || null,
          equipment: equipment || null,
          difficulty: difficulty || null,
          instructions: instructions || null,
          description: description || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Redirect back to the previous page or exercises list
      router.back();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create exercise");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/workouts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Custom Exercise</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Information</CardTitle>
          <CardDescription>
            Create a custom exercise that you can add to your workouts
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Exercise Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Single-Leg Romanian Deadlift"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="muscleGroup">Primary Muscle Group</Label>
                <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chest">Chest</SelectItem>
                    <SelectItem value="Back">Back</SelectItem>
                    <SelectItem value="Shoulders">Shoulders</SelectItem>
                    <SelectItem value="Biceps">Biceps</SelectItem>
                    <SelectItem value="Triceps">Triceps</SelectItem>
                    <SelectItem value="Quadriceps">Quadriceps</SelectItem>
                    <SelectItem value="Hamstrings">Hamstrings</SelectItem>
                    <SelectItem value="Glutes">Glutes</SelectItem>
                    <SelectItem value="Calves">Calves</SelectItem>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Full Body">Full Body</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                    <SelectItem value="Balance">Balance</SelectItem>
                    <SelectItem value="Plyometric">Plyometric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Barbell">Barbell</SelectItem>
                    <SelectItem value="Dumbbells">Dumbbells</SelectItem>
                    <SelectItem value="Kettlebell">Kettlebell</SelectItem>
                    <SelectItem value="Cable Machine">Cable Machine</SelectItem>
                    <SelectItem value="Resistance Bands">
                      Resistance Bands
                    </SelectItem>
                    <SelectItem value="Machine">Machine</SelectItem>
                    <SelectItem value="Pull-up Bar">Pull-up Bar</SelectItem>
                    <SelectItem value="Medicine Ball">Medicine Ball</SelectItem>
                    <SelectItem value="Stability Ball">
                      Stability Ball
                    </SelectItem>
                    <SelectItem value="Foam Roller">Foam Roller</SelectItem>
                    <SelectItem value="TRX/Suspension">
                      TRX/Suspension
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                placeholder="Step-by-step instructions on how to perform this exercise"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Additional information about this exercise"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Exercise"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
