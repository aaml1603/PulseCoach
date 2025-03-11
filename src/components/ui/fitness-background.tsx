"use client";

import { useTheme } from "next-themes";

export function FitnessBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-30 dark:opacity-10">
      {/* Top right dumbbells pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={isDark ? "#ffffff" : "#000000"}>
            <path d="M20,35 h60 a5,5 0 0 1 0,10 h-60 a5,5 0 0 1 0,-10 z" />
            <circle cx="15" cy="40" r="10" />
            <circle cx="85" cy="40" r="10" />
            <circle cx="5" cy="40" r="5" />
            <circle cx="95" cy="40" r="5" />
          </g>
        </svg>
      </div>

      {/* Bottom left heartbeat pattern */}
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 h20 l5,-15 l10,30 l10,-30 l5,15 h50"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Center stopwatch pattern */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.02]">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="20"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="50"
            y1="80"
            x2="50"
            y2="90"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="10"
            y1="50"
            x2="20"
            y2="50"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="50"
            x2="90"
            y2="50"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="30"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="50"
            x2="70"
            y2="50"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
}
