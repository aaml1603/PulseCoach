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
import { Trash2, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // First get the picture to get the image URL
      const { data: picture, error: pictureError } = await supabase
        .from("progress_pictures")
        .select("image_url")
        .eq("id", pictureId)
        .single();

      if (pictureError) {
        throw new Error(
          "Failed to fetch picture details: " + pictureError.message,
        );
      }

      // Try to delete the file from storage if URL exists
      if (
        picture &&
        picture.image_url &&
        !picture.image_url.includes("unsplash.com")
      ) {
        try {
          // Check if the bucket exists first
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some(
            (bucket) => bucket.name === "progress-pictures",
          );

          if (bucketExists) {
            try {
              // Extract the path from the URL
              const url = new URL(picture.image_url);
              const pathParts = url.pathname.split("/");
              const storagePath =
                pathParts[pathParts.length - 2] +
                "/" +
                pathParts[pathParts.length - 1];

              // Delete the file from storage
              await supabase.storage
                .from("progress-pictures")
                .remove([storagePath]);
            } catch (storageError) {
              console.warn("Error deleting file from storage:", storageError);
              // Continue with database deletion even if storage deletion fails
            }
          } else {
            console.warn(
              "Storage bucket 'progress-pictures' not found, skipping file deletion",
            );
          }
        } catch (urlError) {
          console.warn("Error parsing image URL:", urlError);
          // Continue with database deletion even if URL parsing fails
        }
      }

      // Delete the record from the database
      const { error: deleteError } = await supabase
        .from("progress_pictures")
        .delete()
        .eq("id", pictureId);

      if (deleteError) {
        throw new Error(
          "Failed to delete picture record: " + deleteError.message,
        );
      }

      // Close the dialog and redirect
      setOpen(false);
      router.push(`/dashboard/clients/${clientId}/pictures`);
      router.refresh();
    } catch (err: any) {
      console.error("Error deleting progress picture:", err);
      setError(err.message || "An error occurred while deleting the picture");
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

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

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
