import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "high" | "medium" | "low";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    outline: "text-zinc-300 border-zinc-700 bg-transparent",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    high: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
    medium: "bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/20",
    low: "bg-zinc-500/15 text-zinc-300 border-zinc-600/40",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
