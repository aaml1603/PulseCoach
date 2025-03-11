import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

    // Log the token and error for debugging
    console.log("Token used:", token);
    console.log("Client error:", clientError);

    if (clientError || !client) {
      // Check if token is expired based on access_token_expires_at
      if (client && client.access_token_expires_at) {
        const expiryDate = new Date(client.access_token_expires_at);
        if (expiryDate < new Date()) {
          return NextResponse.json(
            {
              error:
                "Access token has expired. Please request a new link from your coach.",
            },
            { status: 401 },
          );
        }
      }

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
