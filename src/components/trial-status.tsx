"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TrialStatus() {
  const [trialData, setTrialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          return;
        }

        // Fetch user trial data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("trial_start_date, trial_end_date")
          .eq("id", user.id)
          .single();

        if (userError) {
          setError("Error fetching trial information");
          return;
        }

        setTrialData(userData);

        // Calculate days remaining in trial
        if (userData?.trial_end_date) {
          const trialEndDate = new Date(userData.trial_end_date);
          const now = new Date();
          const diffTime = trialEndDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysRemaining(diffDays > 0 ? diffDays : 0);
        }
      } catch (err) {
        console.error("Error fetching trial status:", err);
        setError("Failed to load trial data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrialStatus();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse h-4 w-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-muted-foreground">
              Unable to load trial information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no trial data or trial has expired
  if (!trialData?.trial_end_date || daysRemaining === 0) {
    return null; // Don't show anything if no trial or expired
  }

  return (
    <Card className="w-full border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Free Trial</CardTitle>
            <CardDescription>Your trial period is active</CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
          >
            {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">
          You're currently on a free 7-day trial. Enjoy full access to all
          features!
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/pricing">
            <Clock className="mr-2 h-4 w-4" /> Upgrade to continue after trial
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
