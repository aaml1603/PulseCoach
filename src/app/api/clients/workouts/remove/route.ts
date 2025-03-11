import { createClient } from "../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientWorkoutId } = await request.json();

    if (!clientWorkoutId) {
      return NextResponse.json(
        { error: "Client workout ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the user is authorized
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the client workout to verify ownership
    const { data: clientWorkout, error: workoutError } = await supabase
      .from("client_workouts")
      .select("client_id, clients!inner(coach_id)")
      .eq("id", clientWorkoutId)
      .single();

    if (workoutError || !clientWorkout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Check if the user is the coach of this client
    if (clientWorkout.clients.coach_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the client workout
    const { error: deleteError } = await supabase
      .from("client_workouts")
      .delete()
      .eq("id", clientWorkoutId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
