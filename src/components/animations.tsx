"use client";

import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <div
      className={`animate-fadeIn ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideUp({
  children,
  className = "",
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <div
      className={`animate-slideUp ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideIn({
  children,
  className = "",
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <div
      className={`animate-slideIn ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Scale({
  children,
  className = "",
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <div
      className={`animate-scale ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
