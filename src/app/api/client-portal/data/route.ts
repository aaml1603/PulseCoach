import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Fetch client details using the access token
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("access_token", token)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 404 },
      );
    }

    // Fetch assigned workouts for this client
    const { data: clientWorkouts, error: workoutsError } = await supabase
      .from("client_workouts")
      .select(
        `
        *,
        workout:workouts(*)
      `,
      )
      .eq("client_id", client.id)
      .order("assigned_date", { ascending: false });

    // Fetch workout exercises for each workout
    const workoutIds = clientWorkouts?.map((cw) => cw.workout_id) || [];
    const { data: workoutExercises, error: exercisesError } = await supabase
      .from("workout_exercises")
      .select(
        `
        *,
        exercise:exercises(*)
      `,
      )
      .in("workout_id", workoutIds)
      .order("order_index");

    // Group exercises by workout_id for easier access
    const exercisesByWorkout: Record<string, any[]> = {};
    workoutExercises?.forEach((we) => {
      if (!exercisesByWorkout[we.workout_id]) {
        exercisesByWorkout[we.workout_id] = [];
      }
      exercisesByWorkout[we.workout_id].push(we);
    });

    return NextResponse.json({
      client,
      clientWorkouts,
      exercisesByWorkout,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
