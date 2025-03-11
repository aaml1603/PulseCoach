import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientWorkoutId, feedback, accessToken, difficultyRating } =
      await request.json();

    if (!clientWorkoutId || !accessToken) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the access token belongs to the client associated with this workout
    const { data: clientWorkout, error: workoutError } = await supabase
      .from("client_workouts")
      .select("client_id, workout_id, status")
      .eq("id", clientWorkoutId)
      .single();

    if (workoutError) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Verify the access token matches the client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, name, coach_id")
      .eq("id", clientWorkout.client_id)
      .eq("access_token", accessToken)
      .single();

    if (clientError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get workout name for the notification
    const { data: workout, error: workoutNameError } = await supabase
      .from("workouts")
      .select("name")
      .eq("id", clientWorkout.workout_id)
      .single();

    if (workoutNameError) {
      return NextResponse.json(
        { error: "Workout details not found" },
        { status: 404 },
      );
    }

    // Create a workout log entry
    const { data: logData, error: logError } = await supabase
      .from("client_workout_logs")
      .insert({
        client_workout_id: clientWorkoutId,
        completed_date: new Date().toISOString(),
        feedback: feedback || null,
        difficulty_rating: difficultyRating || null,
      })
      .select()
      .single();

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    // Update the workout status to completed if not already
    if (clientWorkout.status !== "completed") {
      const { error: updateError } = await supabase
        .from("client_workouts")
        .update({
          status: "completed",
        })
        .eq("id", clientWorkoutId);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 },
        );
      }
    }

    // Create a notification for the coach
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: client.coach_id,
        title: "Workout Completed",
        message: `${client.name} completed the workout "${workout.name}" and ${feedback ? "left feedback: " + feedback : "didn't leave any feedback"}.${difficultyRating ? " Difficulty rating: " + difficultyRating + "/10." : ""} `,
        type: "workout_completed",
        related_entity_id: clientWorkoutId,
        related_entity_type: "client_workout",
        is_read: false,
      });

    if (notificationError) {
      return NextResponse.json(
        { error: notificationError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
