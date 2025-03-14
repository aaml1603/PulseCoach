import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientWorkoutId, accessToken } = await request.json();

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

    // Update the workout status to completed
    const { error: updateError } = await supabase
      .from("client_workouts")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientWorkoutId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create a notification for the coach
    const { data: workout, error: workoutNameError } = await supabase
      .from("workouts")
      .select("name")
      .eq("id", clientWorkout.workout_id)
      .single();

    if (!workoutNameError && workout) {
      await supabase.from("notifications").insert({
        user_id: client.coach_id,
        title: "Workout Completed",
        message: `${client.name} completed the workout "${workout.name}".`,
        type: "workout_completed",
        related_entity_id: clientWorkoutId,
        related_entity_type: "client_workout",
        is_read: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
