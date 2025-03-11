"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeightChartProps {
  metrics: any[];
  clientName: string;
}

export default function WeightChart({ metrics, clientName }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!metrics || metrics.length === 0 || !canvasRef.current) return;

    // Sort metrics by date (oldest to newest)
    const sortedMetrics = [...metrics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Filter out metrics without weight data
    const weightMetrics = sortedMetrics.filter(
      (metric) => metric.weight !== null,
    );

    if (weightMetrics.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Find min and max weight values
    const weights = weightMetrics.map((metric) => metric.weight);
    let minWeight = Math.min(...weights);
    let maxWeight = Math.max(...weights);

    // Add some padding to min/max for better visualization
    const weightRange = maxWeight - minWeight;
    minWeight = Math.max(0, minWeight - weightRange * 0.1);
    maxWeight = maxWeight + weightRange * 0.1;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0"; // Tailwind gray-200
    ctx.lineWidth = 1;

    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);

    // X-axis
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw grid lines
    const yGridLines = 5;
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0"; // Tailwind gray-200
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= yGridLines; i++) {
      const y = padding + (chartHeight * i) / yGridLines;
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);

      // Add weight labels
      const weightValue =
        maxWeight - ((maxWeight - minWeight) * i) / yGridLines;
      ctx.fillStyle = "#64748b"; // Tailwind gray-500
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(weightValue.toFixed(1), padding - 5, y + 3);
    }
    ctx.stroke();

    // Plot weight data points
    const xStep = chartWidth / (weightMetrics.length - 1 || 1);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6"; // Tailwind blue-500
    ctx.lineWidth = 2;

    weightMetrics.forEach((metric, index) => {
      const x = padding + index * xStep;
      const normalizedWeight =
        (metric.weight - minWeight) / (maxWeight - minWeight);
      const y = padding + chartHeight - normalizedWeight * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Add date labels for first, middle and last points
      if (
        index === 0 ||
        index === weightMetrics.length - 1 ||
        index === Math.floor(weightMetrics.length / 2)
      ) {
        const date = new Date(metric.date).toLocaleDateString();
        ctx.fillStyle = "#64748b"; // Tailwind gray-500
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(date, x, padding + chartHeight + 15);
      }
    });
    ctx.stroke();

    // Draw data points
    weightMetrics.forEach((metric, index) => {
      const x = padding + index * xStep;
      const normalizedWeight =
        (metric.weight - minWeight) / (maxWeight - minWeight);
      const y = padding + chartHeight - normalizedWeight * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6"; // Tailwind blue-500
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Add title
    ctx.fillStyle = "#1e293b"; // Tailwind slate-800
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Weight Progress (kg)`, canvas.width / 2, 20);
  }, [metrics, clientName]);

  if (!metrics || metrics.filter((m) => m.weight !== null).length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
