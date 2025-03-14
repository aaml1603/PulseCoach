"use client";

import { useState, useEffect } from "react";
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
import { Dumbbell, Search, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickWorkoutAssign() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

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
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleClientSelect = async (clientId: string) => {
    setSelectedClient(clientId);
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

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
    }
  };

  const assignWorkout = async () => {
    if (!selectedClient || !selectedWorkout) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      // Insert the new client workout assignment
      const { error } = await supabase.from("client_workouts").insert({
        client_id: selectedClient,
        workout_id: selectedWorkout,
        assigned_date: new Date().toISOString(),
        status: "assigned",
      });

      if (error) throw error;

      // Send email notification to client
      try {
        await fetch("/api/client-portal/notify-workout-assigned", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: selectedClient,
            workoutId: selectedWorkout,
          }),
        });
      } catch (notifyError) {
        console.error("Error sending notification email:", notifyError);
        // Continue with success flow even if email fails
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setOpen(false);
        setSelectedClient("");
        setSelectedWorkout("");
        setSearchQuery("");
        setClients([]);
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Error assigning workout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Search className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {clients.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => handleClientSelect(client.id)}
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
                  <div className="text-center py-4 text-muted-foreground">
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

                {workouts.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No workouts available. Create a workout first.
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClient("")}
                  >
                    Back to Client Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {selectedClient && selectedWorkout && !isSuccess && (
            <Button onClick={assignWorkout} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
