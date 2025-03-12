import { createClient } from "../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserCircle,
  Edit,
  Dumbbell,
  LineChart,
  ArrowLeft,
  ImageIcon,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import WeightChartRecharts from "@/components/weight-chart-recharts";
import ClientPortalLink from "@/components/client-portal-link";
import DeleteClientButton from "@/components/delete-client-button";
import RemoveClientWorkoutButton from "@/components/remove-client-workout-button";
import { kgToLbs, formatCmToFeetInches } from "@/utils/unit-conversion";

export default async function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch client details
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .eq("coach_id", user.id)
    .single();

  if (error || !client) {
    return notFound();
  }

  // Fetch latest metrics for this client
  const { data: latestMetrics } = await supabase
    .from("client_metrics")
    .select("*")
    .eq("client_id", params.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  // Fetch all weight metrics for chart
  const { data: allMetrics } = await supabase
    .from("client_metrics")
    .select("id, date, weight")
    .eq("client_id", params.id)
    .order("date", { ascending: true });

  // Fetch assigned workouts
  const { data: clientWorkouts } = await supabase
    .from("client_workouts")
    .select(
      `
      *,
      workout:workouts(*)
    `,
    )
    .eq("client_id", params.id)
    .order("assigned_date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Client Details</h1>
      </div>

      {/* Client Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-blue-100 rounded-full p-6 mb-4">
                <UserCircle className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-sm text-muted-foreground">
                {client.email || "No email"}
              </p>
              <p className="text-sm text-muted-foreground">
                {client.phone || "No phone"}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`ml-2 text-sm ${client.status === "active" ? "text-green-600" : "text-muted-foreground"}`}
                >
                  {client.status || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Start Date:</span>
                <span className="ml-2 text-sm">
                  {new Date(client.start_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Goal:</span>
                <p className="mt-1 text-sm">{client.goal || "No goal set"}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Notes:</span>
                <p className="mt-1 text-sm">{client.notes || "No notes"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/clients/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/clients/${params.id}/pictures`}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Progress Pictures
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href={`/dashboard/clients/${params.id}/messages`}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Messages
                </Link>
              </Button>
              <ClientPortalLink clientId={params.id} clientName={client.name} />
              <DeleteClientButton
                clientId={params.id}
                clientName={client.name}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metrics Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fitness Metrics</CardTitle>
            <Button asChild>
              <Link href={`/dashboard/clients/${params.id}/metrics/new`}>
                Log New Metrics
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {latestMetrics ? (
              <div>
                <div className="text-sm text-muted-foreground mb-4">
                  Last updated:{" "}
                  {new Date(latestMetrics.date).toLocaleDateString()}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {latestMetrics.weight && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Weight
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.weight} kg
                        <span className="text-sm text-muted-foreground ml-2">
                          ({kgToLbs(latestMetrics.weight)} lbs)
                        </span>
                      </div>
                    </div>
                  )}
                  {latestMetrics.body_fat_percentage && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Body Fat
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.body_fat_percentage}%
                      </div>
                    </div>
                  )}
                  {latestMetrics.chest_measurement && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Chest
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.chest_measurement} cm
                      </div>
                    </div>
                  )}
                  {latestMetrics.waist_measurement && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Waist
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.waist_measurement} cm
                      </div>
                    </div>
                  )}
                  {latestMetrics.hip_measurement && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Hip
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.hip_measurement} cm
                      </div>
                    </div>
                  )}
                  {latestMetrics.arm_measurement && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Arms
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.arm_measurement} cm
                      </div>
                    </div>
                  )}
                  {latestMetrics.thigh_measurement && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Thighs
                      </div>
                      <div className="text-2xl font-bold">
                        {latestMetrics.thigh_measurement} cm
                      </div>
                    </div>
                  )}
                </div>
                {latestMetrics.notes && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      Notes
                    </div>
                    <div className="text-sm mt-1">{latestMetrics.notes}</div>
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/dashboard/clients/${params.id}/metrics`}>
                      <LineChart className="mr-2 h-4 w-4" /> View All Metrics
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No metrics recorded yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Start tracking your client's progress by logging their first
                  metrics.
                </p>
                <Button asChild>
                  <Link href={`/dashboard/clients/${params.id}/metrics/new`}>
                    Log First Metrics
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weight Progress Chart */}
      <WeightChartRecharts
        metrics={allMetrics || []}
        clientName={client.name}
      />

      {/* Workouts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Workouts</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/clients/${params.id}/workouts/create`}>
                Create Personalized
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/clients/${params.id}/workouts/assign`}>
                Assign Existing
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clientWorkouts && clientWorkouts.length > 0 ? (
            <div className="space-y-4">
              {clientWorkouts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex-shrink-0 bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">
                        {item.workout.name}
                      </h3>
                      <RemoveClientWorkoutButton
                        clientWorkoutId={item.id}
                        workoutName={item.workout.name}
                        clientId={params.id}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Assigned:</span>{" "}
                        {new Date(item.assigned_date).toLocaleDateString()}
                      </div>
                      {item.due_date && (
                        <div>
                          <span className="text-muted-foreground">Due:</span>{" "}
                          {new Date(item.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "completed" ? "bg-green-100 text-green-800" : item.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-muted text-muted-foreground"}`}
                      >
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "in_progress"
                            ? "In Progress"
                            : "Assigned"}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No workouts assigned yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Assign workouts to help your client reach their fitness goals.
              </p>
              <Button asChild>
                <Link href={`/dashboard/clients/${params.id}/workouts/assign`}>
                  Assign First Workout
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
