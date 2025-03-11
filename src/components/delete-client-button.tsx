"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface DeleteClientButtonProps {
  clientId: string;
  clientName: string;
}

export default function DeleteClientButton({
  clientId,
  clientName,
}: DeleteClientButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Delete all related data in the correct order to respect foreign key constraints

      // 1. Delete progress pictures
      await supabase
        .from("progress_pictures")
        .delete()
        .eq("client_id", clientId);

      // 2. Delete client metrics
      await supabase.from("client_metrics").delete().eq("client_id", clientId);

      // 3. Delete client workout logs and related exercise logs
      const { data: clientWorkouts } = await supabase
        .from("client_workouts")
        .select("id")
        .eq("client_id", clientId);

      if (clientWorkouts && clientWorkouts.length > 0) {
        const workoutIds = clientWorkouts.map((workout) => workout.id);

        // 3a. Get all workout logs for these client workouts
        const { data: workoutLogs } = await supabase
          .from("client_workout_logs")
          .select("id")
          .in("client_workout_id", workoutIds);

        if (workoutLogs && workoutLogs.length > 0) {
          const logIds = workoutLogs.map((log) => log.id);

          // 3b. Delete exercise logs for these workout logs
          await supabase
            .from("client_exercise_logs")
            .delete()
            .in("client_workout_log_id", logIds);

          // 3c. Delete the workout logs
          await supabase.from("client_workout_logs").delete().in("id", logIds);
        }

        // 3d. Delete client workouts
        await supabase
          .from("client_workouts")
          .delete()
          .eq("client_id", clientId);
      }

      // 4. Delete client-specific workouts
      await supabase.from("workouts").delete().eq("client_id", clientId);

      // 5. Delete client goals if they exist
      await supabase.from("client_goals").delete().eq("client_id", clientId);

      // 6. Finally delete the client
      await supabase.from("clients").delete().eq("id", clientId);

      // Close the dialog and redirect
      setOpen(false);
      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" /> Remove Client
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {clientName}'s profile and all associated data including workout
            history, progress metrics, and photos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Client"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
