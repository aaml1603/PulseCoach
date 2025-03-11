"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FitnessProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  backgroundColor?: string;
  label?: string;
  animate?: boolean;
}

export function FitnessProgressRing({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  className,
  color = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--muted))",
  label,
  animate = true,
}: FitnessProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const valuePercentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(valuePercentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(valuePercentage);
    }
  }, [valuePercentage, animate]);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: animate ? "stroke-dashoffset 1s ease-in-out" : "none",
          }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold">
            {Math.round(valuePercentage)}%
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}
