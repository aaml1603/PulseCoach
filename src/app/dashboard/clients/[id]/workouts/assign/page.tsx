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
import { ArrowLeft, Dumbbell } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AssignWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch client data
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params.id)
        .single();

      if (client) {
        setClientData(client);
      }

      // Fetch coach's workouts (only general workouts, not client-specific ones)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: workoutData } = await supabase
          .from("workouts")
          .select("*")
          .eq("coach_id", user.id)
          .eq("client_specific", false)
          .order("name");

        if (workoutData) {
          setWorkouts(workoutData);
        }
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedWorkout) {
      setError("Please select a workout to assign");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Insert the new client workout assignment
      const { data, error: insertError } = await supabase
        .from("client_workouts")
        .insert({
          client_id: params.id,
          workout_id: selectedWorkout,
          assigned_date: new Date().toISOString(),
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          notes: notes || null,
          status: "assigned",
        });

      if (insertError) {
        throw insertError;
      }

      // Get the workout name for the success message
      const selectedWorkoutData = workouts.find(
        (w) => w.id === selectedWorkout,
      );
      const workoutName = selectedWorkoutData?.name || "New Workout";

      setSuccess("Workout assigned successfully");

      // Redirect to the client details page
      router.push(`/dashboard/clients/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to assign workout");
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
        <h1 className="text-3xl font-bold">Assign Existing Workout</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Assign Existing Workout to {clientData?.name || "Client"}
          </CardTitle>
          <CardDescription>
            Select from your library of workout plans to assign to your client
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                {success}
              </div>
            )}

            {workouts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No workouts available</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Create a workout plan first before assigning to clients.
                </p>
                <Button asChild>
                  <Link href="/dashboard/workouts/new">Create Workout</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workout">Select Workout *</Label>
                  <Select
                    value={selectedWorkout}
                    onValueChange={setSelectedWorkout}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a workout plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {workouts.map((workout) => (
                        <SelectItem key={workout.id} value={workout.id}>
                          {workout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional instructions or notes for this workout assignment"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>

          {workouts.length > 0 && (
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/clients/${params.id}`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || workouts.length === 0}
              >
                {isLoading ? "Assigning..." : "Assign Workout"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
