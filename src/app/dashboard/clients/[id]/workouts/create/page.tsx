"use client";

import { useState } from "react";
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
import { createClient } from "../../../../../../../supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateClientWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) {
      setError("Workout name is required");
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
        throw new Error("You must be logged in to create a workout");
      }

      // First, create the workout
      const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          coach_id: user.id,
          name,
          description: description || null,
          client_specific: true, // Mark as client-specific
          client_id: params.id, // Associate with this client
        })
        .select()
        .single();

      if (workoutError) {
        throw workoutError;
      }

      // Then, assign it to the client
      const { error: assignError } = await supabase
        .from("client_workouts")
        .insert({
          client_id: params.id,
          workout_id: workoutData.id,
          assigned_date: new Date().toISOString(),
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          notes: notes || null,
          status: "assigned",
        });

      if (assignError) {
        throw assignError;
      }

      // Send email notification to client
      try {
        await fetch("/api/client-portal/notify-workout-assigned", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: params.id,
            workoutId: workoutData.id,
          }),
        });
      } catch (notifyError) {
        console.error("Error sending notification email:", notifyError);
        // Continue with success flow even if email fails
      }

      // Redirect to the workout details page to add exercises
      router.push(`/dashboard/workouts/${workoutData.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create workout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Personalized Workout</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Workout Information</CardTitle>
          <CardDescription>
            Create a custom workout plan specifically for this client
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
              <Label htmlFor="name">Workout Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., John's Upper Body Routine"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Workout Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this personalized workout plan"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes for Client</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions or notes for this client"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/clients/${params.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create & Continue to Add Exercises"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
