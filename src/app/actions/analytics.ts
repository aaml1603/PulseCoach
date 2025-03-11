"use server";

import { createClient } from "../../../supabase/server";

export async function getClientAnalytics(coachId: string) {
  const supabase = await createClient();

  // Get total client count
  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("coach_id", coachId);

  // Get active clients (those with workouts assigned in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: activeClientsData } = await supabase
    .from("client_workouts")
    .select("client_id")
    .eq("status", "completed")
    .gte("assigned_date", thirtyDaysAgo.toISOString())
    .eq("workouts!inner(coach_id)", coachId);

  // Count unique client IDs
  const activeClientIds = new Set();
  activeClientsData?.forEach((workout) => {
    activeClientIds.add(workout.client_id);
  });

  const activeClients = activeClientIds.size;

  // Calculate retention rate
  const retentionRate = totalClients
    ? Math.round((activeClients / totalClients) * 100)
    : 0;

  // Get weekly sessions (completed workouts in the last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: weeklySessions } = await supabase
    .from("client_workouts")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")
    .gte("assigned_date", sevenDaysAgo.toISOString())
    .eq("workouts!inner(coach_id)", coachId);

  // Get previous week's sessions for comparison
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { count: previousWeekSessions } = await supabase
    .from("client_workouts")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")
    .gte("assigned_date", fourteenDaysAgo.toISOString())
    .lt("assigned_date", sevenDaysAgo.toISOString())
    .eq("workouts!inner(coach_id)", coachId);

  // Calculate weekly change percentage
  let weeklyChangePercent = 0;
  if (previousWeekSessions && weeklySessions !== null) {
    weeklyChangePercent = Math.round(
      ((weeklySessions - previousWeekSessions) / previousWeekSessions) * 100,
    );
  }

  // Get goal completion data
  const { data: clientGoals } = await supabase
    .from("client_goals")
    .select("status, clients!inner(coach_id)")
    .eq("clients.coach_id", coachId);

  const totalGoals = clientGoals?.length || 0;
  const completedGoals =
    clientGoals?.filter((goal) => goal.status === "completed").length || 0;
  const goalCompletionRate = totalGoals
    ? Math.round((completedGoals / totalGoals) * 100)
    : 0;

  return {
    totalClients: totalClients || 0,
    activeClients,
    retentionRate,
    weeklySessions: weeklySessions || 0,
    weeklyChangePercent,
    goalCompletionRate,
    remainingGoals: totalGoals - completedGoals,
  };
}
