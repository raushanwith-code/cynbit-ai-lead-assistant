"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CynbitNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">Cynbit</span>
              <span className="text-cyan-400 font-semibold text-xs tracking-wider uppercase">Technologies</span>
            </div>
            <span className="text-[10px] text-zinc-400">Engineering Intelligent Digital Futures</span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-300">
          <a href="#services" className="hover:text-cyan-400 transition-colors">
            Services
          </a>
          <a href="#solutions" className="hover:text-cyan-400 transition-colors">
            AI Innovation
          </a>
          <a href="#testimonials" className="hover:text-cyan-400 transition-colors">
            Case Studies
          </a>
          <a
            href="https://cynbit.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            cynbit.in ↗
          </a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </Button>
          </Link>

          <a href="#chat">
            <Button
              size="sm"
              className="text-xs h-9 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-90 text-white shadow-md shadow-cyan-500/20 font-semibold"
            >
              <span>Instant AI Quote</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
