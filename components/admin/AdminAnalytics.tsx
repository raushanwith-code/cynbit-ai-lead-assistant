"use client";

import React from "react";
import { PieChart, Activity, Zap } from "lucide-react";
import { ILeadStats } from "@/types";

interface AdminAnalyticsProps {
  stats: ILeadStats | null;
}

export function AdminAnalytics({ stats }: AdminAnalyticsProps) {
  if (!stats) return null;

  const serviceColors: Record<string, string> = {
    "AI Automation": "bg-cyan-500",
    "Web Development": "bg-blue-500",
    "Mobile App Development": "bg-indigo-500",
    "Cloud Solutions": "bg-emerald-500",
    "Technical Consulting": "bg-purple-500",
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 my-6">
      {/* Service Distribution */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Service Demand Breakdown</h4>
          </div>
          <span className="text-[11px] text-zinc-400">By AI Recommendations</span>
        </div>

        <div className="mt-4 space-y-3.5">
          {stats.serviceDistribution.map((item, idx) => {
            const barColor = serviceColors[item.service] || "bg-cyan-500";
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">{item.service}</span>
                  <span className="font-semibold text-zinc-400">
                    {item.count} leads ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Scoring Breakdown */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Lead Score Matrix</h4>
          </div>
          <span className="text-[11px] text-zinc-400">Budget Criteria</span>
        </div>

        <div className="mt-4 space-y-4">
          {/* High Score */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400">High Priority</span>
                <p className="text-[11px] text-zinc-400">Budget &gt; ₹1 Lakh</p>
              </div>
              <span className="text-xl font-extrabold text-white">{stats.highPriorityCount}</span>
            </div>
          </div>

          {/* Medium Score */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-400">Medium Priority</span>
                <p className="text-[11px] text-zinc-400">₹50k - ₹1 Lakh</p>
              </div>
              <span className="text-xl font-extrabold text-white">{stats.mediumPriorityCount}</span>
            </div>
          </div>

          {/* Low Score */}
          <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-300">Low Priority</span>
                <p className="text-[11px] text-zinc-400">Below ₹50k</p>
              </div>
              <span className="text-xl font-extrabold text-white">{stats.lowPriorityCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Lead Funnel Status</h4>
          </div>
          <span className="text-[11px] text-zinc-400">Conversion Flow</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {stats.statusDistribution.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-zinc-950/50 px-3 py-2 border border-zinc-800/60"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-medium text-zinc-300">{item.status}</span>
              </div>
              <span className="font-mono text-xs font-bold text-zinc-100">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
