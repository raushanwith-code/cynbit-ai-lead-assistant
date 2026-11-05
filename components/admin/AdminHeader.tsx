"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, LogOut, ExternalLink, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onExportCSV: () => void;
  onSeedData: () => void;
  onLogout: () => void;
  isSeeding?: boolean;
}

export function AdminHeader({ onExportCSV, onSeedData, onLogout, isSeeding }: AdminHeaderProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        }).format(new Date())
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">Cynbit</span>
                <span className="text-cyan-400 font-medium text-xs">Technologies</span>
              </div>
              <p className="text-[10px] text-zinc-400">AI Lead Qualification Command Center</p>
            </div>
          </Link>

          <span className="hidden md:inline-block h-4 w-px bg-zinc-800" />

          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1 text-xs text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Live Clock & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {time && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{time}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onSeedData}
            disabled={isSeeding}
            className="text-xs h-9"
            title="Populate demo leads for testing"
          >
            <Database className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Seed Leads</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onExportCSV}
            className="text-xs h-9 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
            title="Download CSV export"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-xs h-9 text-zinc-400 hover:text-rose-400"
            title="Sign out of Admin"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
