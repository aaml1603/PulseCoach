"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<string, { label: string; color: string }>;

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue>(
  {} as ChartContextValue,
);

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const value = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={value}>
      <div
        className={cn("h-[350px] w-full", className)}
        style={{
          ...Object.entries(config).reduce(
            (acc, [key, { color }]) => {
              acc[`--color-${key}`] = color;
              return acc;
            },
            {} as Record<string, string>,
          ),
        }}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export function ChartTooltip({
  cursor = true,
  content,
  ...props
}: React.ComponentProps<"g"> & {
  cursor?: boolean;
  content: React.ReactNode;
}) {
  return (
    <g>
      {cursor && <g className="recharts-tooltip-cursor" {...props} />}
      {content}
    </g>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: Record<string, any>;
  }>;
  label?: string;
  indicator?: "line" | "dot";
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
}: ChartTooltipContentProps) {
  const { config } = React.useContext(ChartContext);

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <div className="text-sm font-medium">{label}</div>
        </div>
        <div className="grid gap-1">
          {payload.map(({ name, value }) => {
            const { label, color } = config[name] ?? {
              label: name,
              color: "hsl(var(--chart-1))",
            };
            return (
              <div key={name} className="flex items-center gap-2">
                {indicator === "line" ? (
                  <div
                    className="h-0.5 w-4"
                    style={{ backgroundColor: color }}
                  />
                ) : (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <div className="text-xs font-medium">{label}</div>
                <div className="ml-auto text-xs font-medium">{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
