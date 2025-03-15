"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "../../supabase/client";
import { Dumbbell, Search, Loader2, CheckCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";

interface Client {
  id: string;
  name: string;
}

interface Workout {
  id: string;
  name: string;
}

export default function QuickWorkoutAssign() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(() => {
    // Default due date is 7 days from today
    const defaultDate = addDays(new Date(), 7);
    return format(defaultDate, "yyyy-MM-dd");
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Reset form state when dialog closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form state when dialog closes
      setTimeout(() => {
        setSelectedClient("");
        setSelectedWorkout("");
        setSearchQuery("");
        setClients([]);
        setError(null);
        setIsSuccess(false);
        // Reset due date to default (7 days from today)
        const defaultDate = addDays(new Date(), 7);
        setDueDate(format(defaultDate, "yyyy-MM-dd"));
      }, 300); // Small delay to allow close animation
    }
  }, []);

  // Search clients as user types
  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setClients([]);
        return;
      }

      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("clients")
          .select("id, name")
          .ilike("name", `%${searchQuery}%`)
          .order("name")
          .limit(10);

        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error("Error searching clients:", err);
        setError("Failed to search clients. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleClientSelect = useCallback(async (clientId: string) => {
    setSelectedClient(clientId);
    setError(null);
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setError("Authentication error. Please sign in again.");
        return;
      }

      // Fetch coach's workouts (only general workouts, not client-specific ones)
      const { data, error } = await supabase
        .from("workouts")
        .select("id, name")
        .eq("coach_id", user.id)
        .eq("client_specific", false)
        .order("name");

      if (error) throw error;
      setWorkouts(data || []);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workouts. Please try again.");
    }
  }, []);

  const assignWorkout = useCallback(async () => {
    if (!selectedClient || !selectedWorkout) return;
    if (!dueDate) {
      setError("Please select a due date");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      // Insert the new client workout assignment
      const { error } = await supabase.from("client_workouts").insert({
        client_id: selectedClient,
        workout_id: selectedWorkout,
        assigned_date: new Date().toISOString(),
        due_date: new Date(dueDate).toISOString(),
        status: "assigned",
      });

      if (error) throw error;

      // Send email notification to client
      try {
        const response = await fetch(
          "/api/client-portal/notify-workout-assigned",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientId: selectedClient,
              workoutId: selectedWorkout,
              dueDate: dueDate,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Email notification API error:", errorData);
          // Continue with success flow even if email fails
        }
      } catch (notifyError) {
        console.error("Error sending notification email:", notifyError);
        // Continue with success flow even if email fails
      }

      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Error assigning workout:", err);
      setError("Failed to assign workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient, selectedWorkout, dueDate, router]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2">
          <Dumbbell className="h-4 w-4" />
          Quick Assign Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Workout to Client</DialogTitle>
          <DialogDescription>
            Quickly assign a workout to a client from your dashboard.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">Workout Assigned!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The workout has been successfully assigned to your client.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {!selectedClient ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="client-search">Search Client</Label>
                    <div className="relative">
                      <div className="flex items-center">
                        <Input
                          id="client-search"
                          placeholder="Enter client name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 pr-8"
                          aria-label="Search for a client"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isSearching ? (
                            <Loader2
                              className="h-4 w-4 animate-spin text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : (
                            <Search
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {clients.length > 0 && (
                  <div
                    className="border rounded-md divide-y"
                    role="listbox"
                    aria-label="Client search results"
                  >
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => handleClientSelect(client.id)}
                        role="option"
                        aria-selected="false"
                      >
                        <span>{client.name}</span>
                        <Button variant="ghost" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && clients.length === 0 && !isSearching && (
                  <div
                    className="text-center py-4 text-muted-foreground"
                    aria-live="polite"
                  >
                    No clients found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workout">Select Workout</Label>
                  <Select
                    value={selectedWorkout}
                    onValueChange={setSelectedWorkout}
                  >
                    <SelectTrigger id="workout">
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

                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <div className="relative">
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full"
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {workouts.length === 0 && (
                  <div
                    className="text-center py-4 text-muted-foreground"
                    aria-live="polite"
                  >
                    No workouts available. Create a workout first.
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClient("")}
                    type="button"
                  >
                    Back to Client Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)} type="button">
            Cancel
          </Button>
          {selectedClient && selectedWorkout && !isSuccess && (
            <Button
              onClick={assignWorkout}
              disabled={isLoading || !dueDate}
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Assigning...
                </>
              ) : (
                "Assign Workout"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
