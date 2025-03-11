"use client";

import { useState, useRef } from "react";
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
import { ArrowLeft, Upload, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UploadProgressPicturePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedFile) {
      setError("Please select an image to upload");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Upload the image to Supabase Storage
      const fileName = `${Date.now()}_${selectedFile.name.replace(/\s+/g, "_")}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("progress-pictures")
        .upload(`${params.id}/${fileName}`, selectedFile);

      if (uploadError) {
        throw new Error("Failed to upload image: " + uploadError.message);
      }

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("progress-pictures")
        .getPublicUrl(`${params.id}/${fileName}`);

      // Save the progress picture record in the database
      const { error: insertError } = await supabase
        .from("progress_pictures")
        .insert({
          client_id: params.id,
          image_url: urlData.publicUrl,
          date: new Date().toISOString(),
          notes: notes || null,
        });

      if (insertError) {
        throw new Error(
          "Failed to save picture record: " + insertError.message,
        );
      }

      setSuccess("Progress picture uploaded successfully");

      // Clear form
      clearSelectedFile();
      setNotes("");

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/clients/${params.id}/pictures`);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to upload progress picture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${params.id}/pictures`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Upload Progress Picture</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Progress Picture</CardTitle>
          <CardDescription>
            Upload a new progress picture to track your client's visual changes
            over time
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

            <div className="space-y-2">
              <Label htmlFor="picture">Progress Picture *</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                {!previewUrl ? (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF (max. 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelectedFile();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="picture"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this progress picture (e.g., weight, measurements, or observations)"
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/clients/${params.id}/pictures`)
              }
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFile}>
              {isLoading ? "Uploading..." : "Upload Picture"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
