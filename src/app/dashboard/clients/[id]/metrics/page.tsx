import { createClient } from "../../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LineChart, PlusCircle } from "lucide-react";
import Link from "next/link";
import WeightChartRecharts from "@/components/weight-chart-recharts";
import { kgToLbs, formatCmToFeetInches } from "@/utils/unit-conversion";

export default async function ClientMetricsPage({
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
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .eq("coach_id", user.id)
    .single();

  if (clientError || !client) {
    return notFound();
  }

  // Fetch all metrics for this client
  const { data: metrics, error: metricsError } = await supabase
    .from("client_metrics")
    .select("*")
    .eq("client_id", params.id)
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/clients/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Metrics History: {client.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/clients/${params.id}/metrics/new`}>
            <PlusCircle className="mr-2 h-4 w-4" /> Log New Metrics
          </Link>
        </Button>
      </div>

      {/* Client Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Gender</span>
              <div className="font-medium">
                {client.gender || "Not specified"}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Height</span>
              <div className="font-medium">
                {client.height ? (
                  <>
                    {client.height} cm
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatCmToFeetInches(client.height)})
                    </span>
                  </>
                ) : (
                  "Not specified"
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Goal</span>
              <div className="font-medium">
                {client.goal || "Not specified"}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="font-medium">{client.status}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Progress Chart */}
      <WeightChartRecharts metrics={metrics || []} clientName={client.name} />

      {/* Metrics History */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics History</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics && metrics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Weight (kg)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Body Fat (%)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Chest (cm)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Waist (cm)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Hip (cm)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Arms (cm)
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">
                      Thighs (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(metric.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {metric.weight ? (
                          <>
                            {metric.weight} kg
                            <span className="text-sm text-muted-foreground ml-2">
                              ({kgToLbs(metric.weight)} lbs)
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {metric.body_fat_percentage || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {metric.chest_measurement || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {metric.waist_measurement || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {metric.hip_measurement || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {metric.arm_measurement || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {metric.thigh_measurement || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <LineChart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No metrics recorded yet</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
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
  );
}
