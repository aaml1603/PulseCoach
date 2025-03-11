"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../../../../supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchWorkout = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setError("Failed to load workout details");
        return;
      }

      if (data) {
        setName(data.name || "");
        setDescription(data.description || "");
        updatePreview(data.description || "");
      }
    };

    fetchWorkout();
  }, [params.id]);

  // No formatting or preview functions needed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name) {
      setError("Workout name is required");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Update the workout
      const { error: updateError } = await supabase
        .from("workouts")
        .update({
          name,
          description: description || null,
        })
        .eq("id", params.id);

      if (updateError) {
        throw updateError;
      }

      // Redirect to the workout details page
      router.push(`/dashboard/workouts/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update workout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/workouts/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Workout</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Information</CardTitle>
          <CardDescription>Update your workout plan details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Workout Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Body Workout"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this workout plan"
                rows={6}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
