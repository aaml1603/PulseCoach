"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
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
        const supabase = createClient();

        // First get the coach profile
        const { data: profileData, error: profileError } = await supabase
          .from("coach_profiles")
          .select("*")
          .eq("user_id", coachId)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          throw profileError;
        }

        // If no profile exists, get basic user info
        if (!profileData) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, name, full_name, email")
            .eq("id", coachId)
            .single();

          if (userError) {
            throw userError;
          }

          setProfile({
            display_name: userData.full_name || userData.name || "Your Coach",
            user_id: userData.id,
            email: userData.email,
          });
        } else {
          setProfile(profileData);
        }
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
      <div className="p-6 bg-white rounded-lg border animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-16 w-16"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <p className="text-red-500 text-sm">Unable to load coach information</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-3">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.display_name}'s profile picture`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <UserCircle className="w-12 h-12 text-blue-600" />
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg text-center">
            {profile?.display_name || "Your Coach"}
          </h3>
          {profile?.title && (
            <p className="text-sm text-gray-600 text-center">{profile.title}</p>
          )}
        </div>

        <div className="w-full md:w-2/3">
          {profile?.bio ? (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          ) : null}

          {profile?.specialties ? (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Specialties</h4>
              <p className="text-sm text-gray-700">{profile.specialties}</p>
            </div>
          ) : null}

          {profile?.certifications ? (
            <div>
              <h4 className="font-semibold mb-2">Certifications</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {profile.certifications}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
