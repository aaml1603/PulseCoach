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

interface RemoveClientWorkoutButtonProps {
  clientWorkoutId: string;
  workoutName: string;
  clientId: string;
}

export default function RemoveClientWorkoutButton({
  clientWorkoutId,
  workoutName,
  clientId,
}: RemoveClientWorkoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Delete the client workout assignment
      const { error } = await supabase
        .from("client_workouts")
        .delete()
        .eq("id", clientWorkoutId);

      if (error) throw error;

      // Close the dialog and refresh the page
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error removing workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Workout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{workoutName}</strong> from
            this client? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove Workout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
