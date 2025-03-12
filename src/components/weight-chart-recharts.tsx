"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WeightChartProps {
  metrics: any[];
  clientName: string;
}

export default function WeightChartRecharts({
  metrics,
  clientName,
}: WeightChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter and sort metrics with weight data
  const weightMetrics = metrics
    .filter((metric) => metric.weight !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!weightMetrics || weightMetrics.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Track weight changes over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Not enough weight data to display a chart.
            <br />
            Log at least two weight measurements to see progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = weightMetrics.map((metric) => ({
    date: new Date(metric.date).toLocaleDateString(),
    weight: metric.weight,
    rawDate: metric.date, // Keep original date for sorting
  }));

  // Calculate trend
  const firstWeight = weightMetrics[0].weight;
  const lastWeight = weightMetrics[weightMetrics.length - 1].weight;
  const weightChange = lastWeight - firstWeight;
  const percentChange = ((weightChange / firstWeight) * 100).toFixed(1);
  const isTrendingUp = weightChange > 0;

  // Get date range for footer
  const startDate = new Date(weightMetrics[0].date).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );
  const endDate = new Date(
    weightMetrics[weightMetrics.length - 1].date,
  ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
        <CardDescription>
          Tracking weight changes for {clientName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={
                isMobile
                  ? { top: 10, right: 10, left: 0, bottom: 0 }
                  : { top: 10, right: 30, left: 0, bottom: 0 }
              }
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? "preserveStartEnd" : 0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={["auto", "auto"]}
                width={isMobile ? 30 : 60}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--color-weight)"
                fill="var(--color-weight)"
                fillOpacity={0.4}
                dot={{ r: isMobile ? 3 : 4 }}
                activeDot={{ r: isMobile ? 5 : 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isTrendingUp ? (
                <>
                  Weight increased by {Math.abs(parseFloat(percentChange))}%
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </>
              ) : (
                <>
                  Weight decreased by {Math.abs(parseFloat(percentChange))}%
                  <TrendingDown className="h-4 w-4 text-green-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {startDate} - {endDate}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
