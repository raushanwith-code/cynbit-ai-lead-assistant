"use client";

import React from "react";
import { Users, Flame, IndianRupee, Layers } from "lucide-react";
import { ILeadStats } from "@/types";
import { formatCurrencyINR } from "@/lib/utils/formatters";

interface StatsCardsProps {
  stats: ILeadStats | null;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const total = stats?.totalLeads || 0;
  const high = stats?.highPriorityCount || 0;
  const medium = stats?.mediumPriorityCount || 0;
  const low = stats?.lowPriorityCount || 0;
  const pipeline = stats?.estimatedPipelineValue || 0;

  const highPct = total > 0 ? Math.round((high / total) * 100) : 0;

  const cards = [
    {
      title: "Total Leads Captured",
      value: loading ? "..." : total.toString(),
      subtext: `${high} high, ${medium} medium, ${low} low`,
      icon: Users,
      glow: "from-cyan-500/20 to-blue-500/10",
      accent: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    {
      title: "High Priority Leads",
      value: loading ? "..." : high.toString(),
      subtext: `${highPct}% of total inbound pipeline`,
      badge: "> ₹1 Lakh",
      icon: Flame,
      glow: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    {
      title: "Est. Pipeline Value",
      value: loading ? "..." : formatCurrencyINR(pipeline),
      subtext: "Based on qualified budget declarations",
      icon: IndianRupee,
      glow: "from-indigo-500/20 to-purple-500/10",
      accent: "text-indigo-400",
      border: "border-indigo-500/30",
    },
    {
      title: "Active Services",
      value: "5 Pillars",
      subtext: "AI, Web, Mobile, Cloud, Consulting",
      icon: Layers,
      glow: "from-blue-500/20 to-cyan-500/10",
      accent: "text-blue-400",
      border: "border-blue-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md`}
          >
            {/* Background gradient glow */}
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.glow} blur-2xl`}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`rounded-xl bg-zinc-800/80 p-2 ${card.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                {card.value}
              </span>
              {card.badge && (
                <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-zinc-400">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
