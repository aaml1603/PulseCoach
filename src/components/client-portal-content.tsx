"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Calendar, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MarkAsCompletedButton from "@/components/mark-as-completed-button";
import CoachProfileView from "@/components/coach-profile-view";
import ClientMessaging from "@/components/client-messaging";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientPortalContent({ token }: { token: string }) {
  const [clientData, setClientData] = useState<any>(null);
  const [clientWorkouts, setClientWorkouts] = useState<any[]>([]);
  const [exercisesByWorkout, setExercisesByWorkout] = useState<
    Record<string, any[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/client-portal/data?token=${token}`);
        if (!response.ok) {
          throw new Error("Failed to load client data");
        }
        const data = await response.json();
        setClientData(data.client || {});
        setClientWorkouts(data.clientWorkouts || []);
        setExercisesByWorkout(data.exercisesByWorkout || {});
      } catch (err) {
        console.error("Error loading client portal data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your workouts...</p>
        </div>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Access Error</h2>
          <p className="text-muted-foreground mb-4">
            This client portal link is invalid or has expired. Please contact
            your coach for a new link.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Error details:{" "}
            {error
              ? "The access token may have expired or is invalid."
              : "No client data found"}
          </p>
          <Button>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {clientData?.name || "Guest"}!
        </h1>
        <p className="text-gray-600">
          Here are your assigned workouts from your coach.
        </p>
      </div>

      <Tabs defaultValue="workouts" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts">
          {/* Coach Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Coach</h2>
            <CoachProfileView coachId={clientData.coach_id} />
          </div>

          {clientWorkouts && clientWorkouts.length > 0 ? (
            <div className="space-y-8">
              {clientWorkouts.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">
                        {item.workout?.name || "Unnamed Workout"}
                      </CardTitle>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "completed" ? "bg-green-100 text-green-800" : item.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "in_progress"
                            ? "In Progress"
                            : "Assigned"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-primary/5 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">
                          Assigned:{" "}
                          {new Date(item.assigned_date).toLocaleDateString()}
                        </span>
                      </div>
                      {item.due_date && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.notes && (
                      <div className="p-4 border-b">
                        <h3 className="font-medium mb-2">Coach Notes:</h3>
                        <p className="text-gray-600">{item.notes}</p>
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-medium mb-4">Exercises:</h3>
                      {exercisesByWorkout[item.workout?.id] ? (
                        <div className="space-y-4">
                          {exercisesByWorkout[item.workout?.id]?.map(
                            (exercise, index) => (
                              <div
                                key={exercise.id}
                                className="flex items-start p-4 border rounded-lg bg-gray-50"
                              >
                                <div className="flex-shrink-0 bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                                  <span className="font-bold text-primary">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">
                                    {exercise.exercise?.name}
                                  </h4>
                                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">
                                        Sets:
                                      </span>{" "}
                                      {exercise.sets}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Reps:
                                      </span>{" "}
                                      {exercise.reps}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Rest:
                                      </span>{" "}
                                      {exercise.rest_time}s
                                    </div>
                                  </div>
                                  {exercise.notes && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      <span className="text-gray-500">
                                        Notes:
                                      </span>{" "}
                                      {exercise.notes}
                                    </div>
                                  )}
                                  {exercise.exercise?.instructions && (
                                    <div className="mt-2 text-sm">
                                      <details className="cursor-pointer">
                                        <summary className="font-medium text-primary">
                                          Instructions
                                        </summary>
                                        <p className="mt-2 text-gray-600 pl-2 border-l-2 border-primary/20">
                                          {exercise.exercise.instructions}
                                        </p>
                                      </details>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No exercises found for this workout.
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t">
                      <MarkAsCompletedButton
                        clientWorkoutId={item.id}
                        accessToken={token}
                        isCompleted={item.status === "completed"}
                        workoutName={item.workout?.name || "Workout"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No workouts assigned yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your coach hasn't assigned any workouts to you yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <ClientMessaging
            token={token}
            clientName={clientData?.name || "Client"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
