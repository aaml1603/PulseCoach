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
import { createClient } from "../../../../supabase/client";
import { ArrowLeft, UserCircle, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CoachProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [specialties, setSpecialties] = useState<string>("");
  const [certifications, setCertifications] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      // Get coach profile data
      const { data: profileData, error: profileError } = await supabase
        .from("coach_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setDisplayName(profileData.display_name || "");
        setTitle(profileData.title || "");
        setBio(profileData.bio || "");
        setSpecialties(profileData.specialties || "");
        setCertifications(profileData.certifications || "");
        setAvatarUrl(profileData.avatar_url || null);
        setUserData({
          ...user,
          profile: profileData,
        });
      } else {
        // If no profile exists yet, use user data
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userData) {
          setDisplayName(userData.full_name || userData.name || "");
          setUserData(userData);
        }
      }
    };

    fetchUserProfile();
  }, [router]);

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to update your profile");
      }

      let newAvatarUrl = avatarUrl;

      // Upload avatar if a new file was selected
      if (selectedFile) {
        try {
          // First check if the bucket exists
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some(
            (bucket) => bucket.name === "coach-avatars",
          );

          if (!bucketExists) {
            console.log(
              "Coach avatars bucket does not exist, using default bucket",
            );
            // Use default bucket as fallback
            const fileName = `avatars/coach_${user.id}_${Date.now()}`;
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("avatars")
                .upload(fileName, selectedFile, {
                  upsert: true,
                });

            if (uploadError) {
              throw new Error(
                "Failed to upload avatar: " + uploadError.message,
              );
            }

            // Get the public URL
            const { data: urlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(fileName);

            newAvatarUrl = urlData.publicUrl;
          } else {
            // Use coach-avatars bucket
            const fileName = `avatar_${user.id}_${Date.now()}`;
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("coach-avatars")
                .upload(fileName, selectedFile, {
                  upsert: true,
                });

            if (uploadError) {
              throw new Error(
                "Failed to upload avatar: " + uploadError.message,
              );
            }

            // Get the public URL
            const { data: urlData } = supabase.storage
              .from("coach-avatars")
              .getPublicUrl(fileName);

            newAvatarUrl = urlData.publicUrl;
          }
        } catch (uploadErr) {
          console.error("Error during avatar upload:", uploadErr);
          throw new Error("Failed to upload avatar. Please try again later.");
        }
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("coach_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("coach_profiles")
          .update({
            display_name: displayName,
            title,
            bio,
            specialties,
            certifications,
            avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from("coach_profiles")
          .insert({
            user_id: user.id,
            display_name: displayName,
            title,
            bio,
            specialties,
            certifications,
            avatar_url: newAvatarUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          throw insertError;
        }
      }

      setSuccess("Profile updated successfully");
      clearSelectedFile();

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Coach Profile</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 text-sm">
          <strong>Note:</strong> This profile will be visible to your clients
          when they access their portal. Make sure to provide information that
          helps build trust and credibility with your clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Public Profile</CardTitle>
          <CardDescription>
            Customize how you appear to clients in their portal
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

            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Upload */}
              <div className="w-full md:w-1/3">
                <Label className="mb-2 block">Profile Picture</Label>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
                    {previewUrl || avatarUrl ? (
                      <Image
                        src={previewUrl || avatarUrl || ""}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <UserCircle className="w-20 h-20 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    {(previewUrl || avatarUrl) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          clearSelectedFile();
                          setAvatarUrl(null);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="w-full md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How you want to be addressed by clients"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Certified Personal Trainer, Nutrition Coach"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your clients about yourself, your background, and your coaching philosophy"
                rows={5}
                className="whitespace-pre-wrap"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Textarea
                id="specialties"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="e.g., Weight Loss, Strength Training, Post-Rehabilitation, Sports Performance"
                rows={3}
                className="whitespace-pre-wrap"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="List your professional certifications and qualifications"
                rows={3}
                className="whitespace-pre-wrap"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>
              This is how clients will see your profile in their portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-3">
                  {previewUrl || avatarUrl ? (
                    <Image
                      src={previewUrl || avatarUrl || ""}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <UserCircle className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-center">
                  {displayName || "Your Name"}
                </h3>
                {title && (
                  <p className="text-sm text-gray-600 text-center">{title}</p>
                )}
              </div>

              <div className="w-full md:w-2/3">
                {bio ? (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {bio}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 rounded border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Add a bio to tell clients about yourself
                    </p>
                  </div>
                )}

                {specialties ? (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Specialties</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {specialties}
                    </p>
                  </div>
                ) : null}

                {certifications ? (
                  <div>
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {certifications}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
