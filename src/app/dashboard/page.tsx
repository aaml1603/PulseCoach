import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  Users,
  Dumbbell,
  LineChart,
  Bell,
  Flame,
  Trophy,
  Activity,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn, SlideUp } from "@/components/animations";
import { FitnessStatsCard } from "@/components/ui/fitness-stats-card";
import { FitnessProgressRing } from "@/components/ui/fitness-progress-ring";
import TrialStatus from "@/components/trial-status";

import { getClientAnalytics } from "../actions/analytics";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get workout count (if any)
  const { data: workouts, error: workoutsError } = await supabase
    .from("workouts")
    .select("id")
    .eq("coach_id", user.id);

  const workoutCount = workouts?.length || 0;

  // Get analytics data
  const analytics = await getClientAnalytics(user.id);

  return (
    <main className="w-full">
      <div className="flex flex-col gap-8">
        <TrialStatus />
        {/* Header Section */}
        <SlideUp className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <div className="bg-primary/5 text-sm p-3 px-4 rounded-lg text-primary flex gap-2 items-center border border-primary/10">
            <InfoIcon size="14" />
            <span>
              Welcome to your FitCoach dashboard! Here you can manage clients,
              create workouts, and track progress.
            </span>
          </div>
        </SlideUp>

        {/* Stats Overview */}
        <FadeIn
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          delay={200}
        >
          <SlideUp delay={100}>
            <FitnessStatsCard
              title="Total Clients"
              value={analytics.totalClients}
              icon="dumbbell"
              description={
                analytics.totalClients > 0
                  ? `${analytics.activeClients} active clients`
                  : "Start adding clients"
              }
              trend="up"
            />
          </SlideUp>

          <SlideUp delay={200}>
            <FitnessStatsCard
              title="Workout Plans"
              value={workoutCount}
              icon="activity"
              description={
                workoutCount > 0
                  ? "Custom training programs"
                  : "Create your first plan"
              }
              trend="up"
            />
          </SlideUp>

          <SlideUp delay={300}>
            <FitnessStatsCard
              title="Weekly Sessions"
              value={analytics.weeklySessions}
              icon="flame"
              description={`${analytics.weeklyChangePercent > 0 ? "+" : ""}${analytics.weeklyChangePercent}% from last week`}
              trend={
                analytics.weeklyChangePercent > 0
                  ? "up"
                  : analytics.weeklyChangePercent < 0
                    ? "down"
                    : "neutral"
              }
            />
          </SlideUp>

          <SlideUp delay={400}>
            <FitnessStatsCard
              title="Client Retention"
              value={`${analytics.retentionRate}%`}
              icon="trophy"
              description={
                analytics.retentionRate > 90
                  ? "Excellent retention rate"
                  : "Active client engagement"
              }
              trend={analytics.retentionRate > 70 ? "up" : "neutral"}
            />
          </SlideUp>
        </FadeIn>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <SlideUp
            className="lg:col-span-2 bg-card rounded-xl p-6 border shadow-sm"
            delay={500}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl">Quick Actions</h2>
              <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                Coach Tools
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                asChild
              >
                <Link href="/dashboard/clients/new">Add New Client</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/workouts">Manage Workouts</Link>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/dashboard/clients">View All Clients</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/exercises/new">Create Exercise</Link>
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard/profile">Update Profile</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard/admin/debug-email">Debug Email</Link>
                </Button>
              </div>
            </div>
          </SlideUp>

          <SlideUp
            className="bg-card rounded-xl p-6 border shadow-sm flex flex-col items-center justify-center"
            delay={600}
          >
            <h3 className="font-semibold text-lg mb-4">Goal Completion</h3>
            <FitnessProgressRing
              value={analytics.goalCompletionRate}
              max={100}
              label="Completion"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {analytics.goalCompletionRate}% of client goals completed
              </p>
              <p className="text-xs text-primary mt-2">
                {analytics.remainingGoals} goals remaining
              </p>
            </div>
          </SlideUp>
        </div>

        {/* User Profile Section */}
        <SlideUp
          className="bg-card rounded-xl p-6 border shadow-sm"
          delay={600}
        >
          <div className="flex items-center gap-4 mb-6">
            <UserCircle size={48} className="text-primary" />
            <div>
              <h2 className="font-semibold text-xl">Coach Profile</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-primary">
              <strong>Tip:</strong> Customize your coach profile to build trust
              with your clients. This profile will be visible when clients
              access their portal.
            </p>
          </div>
        </SlideUp>
      </div>
    </main>
  );
}
