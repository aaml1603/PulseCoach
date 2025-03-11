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

interface DeleteProgressPictureButtonProps {
  pictureId: string;
  clientId: string;
}

export default function DeleteProgressPictureButton({
  pictureId,
  clientId,
}: DeleteProgressPictureButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // First get the picture to get the image URL
      const { data: picture } = await supabase
        .from("progress_pictures")
        .select("image_url")
        .eq("id", pictureId)
        .single();

      if (picture) {
        // Extract the path from the URL
        const url = new URL(picture.image_url);
        const pathParts = url.pathname.split("/");
        const storagePath =
          pathParts[pathParts.length - 2] +
          "/" +
          pathParts[pathParts.length - 1];

        // Delete the file from storage
        await supabase.storage.from("progress-pictures").remove([storagePath]);
      }

      // Delete the record from the database
      await supabase.from("progress_pictures").delete().eq("id", pictureId);

      // Close the dialog and redirect
      setOpen(false);
      router.push(`/dashboard/clients/${clientId}/pictures`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting progress picture:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            progress picture from your client's records.
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
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
