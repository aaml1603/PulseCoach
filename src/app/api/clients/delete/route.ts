import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the user is authorized to delete this client
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the client belongs to this coach
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("coach_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (client.coach_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete all related data in the correct order to respect foreign key constraints

    // 1. Delete progress pictures
    await supabase.from("progress_pictures").delete().eq("client_id", clientId);

    // 2. Delete client metrics
    await supabase.from("client_metrics").delete().eq("client_id", clientId);

    // 3. Delete client workout logs and related exercise logs
    const { data: clientWorkouts } = await supabase
      .from("client_workouts")
      .select("id")
      .eq("client_id", clientId);

    if (clientWorkouts && clientWorkouts.length > 0) {
      const workoutIds = clientWorkouts.map((workout) => workout.id);

      // 3a. Get all workout logs for these client workouts
      const { data: workoutLogs } = await supabase
        .from("client_workout_logs")
        .select("id")
        .in("client_workout_id", workoutIds);

      if (workoutLogs && workoutLogs.length > 0) {
        const logIds = workoutLogs.map((log) => log.id);

        // 3b. Delete exercise logs for these workout logs
        await supabase
          .from("client_exercise_logs")
          .delete()
          .in("client_workout_log_id", logIds);

        // 3c. Delete the workout logs
        await supabase.from("client_workout_logs").delete().in("id", logIds);
      }

      // 3d. Delete client workouts
      await supabase.from("client_workouts").delete().eq("client_id", clientId);
    }

    // 4. Delete client-specific workouts
    await supabase.from("workouts").delete().eq("client_id", clientId);

    // 5. Delete client goals if they exist
    await supabase.from("client_goals").delete().eq("client_id", clientId);

    // 6. Finally delete the client
    const { error: deleteError } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
