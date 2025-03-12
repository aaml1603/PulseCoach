"use client";

import { useEffect, useState } from "react";
import { createClient as createBrowserClient } from "../../supabase/client";

// Create a client with service role key to bypass auth
const createServiceClient = () => {
  return createBrowserClient();
};
import { UserCircle } from "lucide-react";
import Image from "next/image";

interface CoachProfileViewProps {
  coachId: string;
}

export default function CoachProfileView({ coachId }: CoachProfileViewProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);

        // Use the API endpoint instead of direct Supabase access
        const response = await fetch(
          `/api/client-portal/coach-profile?coachId=${coachId}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch coach profile");
        }

        const profileData = await response.json();
        setProfile(profileData);
      } catch (err: any) {
        console.error("Error fetching coach profile:", err);
        setError(err.message || "Failed to load coach profile");
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoachProfile();
    }
  }, [coachId]);

  if (loading) {
    return (
      <div className="p-6 bg-card rounded-lg border animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-muted h-16 w-16"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg border">
        <p className="text-red-500 text-sm">
          Unable to load coach information: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border mb-3">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.display_name}'s profile picture`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src =
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                    profile.display_name;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <UserCircle className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg text-center">
            {profile?.display_name || "Your Coach"}
          </h3>
          {profile?.title && (
            <p className="text-sm text-muted-foreground text-center">
              {profile.title}
            </p>
          )}
        </div>

        <div className="w-full md:w-2/3">
          {profile?.bio ? (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            </div>
          ) : null}

          {profile?.specialties ? (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Specialties</h4>
              <p className="text-sm whitespace-pre-wrap">
                {profile.specialties}
              </p>
            </div>
          ) : null}

          {profile?.certifications ? (
            <div>
              <h4 className="font-semibold mb-2">Certifications</h4>
              <p className="text-sm whitespace-pre-wrap">
                {profile.certifications}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
