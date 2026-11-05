"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CynbitHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden sm:pt-40 sm:pb-28">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-indigo-600/10 blur-[130px]" />
      <div className="absolute top-12 left-10 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs text-cyan-300 shadow-lg shadow-cyan-950/40 backdrop-blur-md mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-semibold">Cynbit Technologies</span>
          <span className="h-3 w-px bg-cyan-500/30" />
          <span className="text-zinc-400">Enterprise Digital &amp; Software Engineering</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
        >
          Empowering Enterprises with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AI Automation
          </span>
          , Web &amp; Cloud Engineering
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed"
        >
          Cynbit Technologies designs and scales intelligent LLM systems, full-stack Next.js
          web applications, cross-platform mobile apps, and robust cloud DevOps architectures.
          Chat with our AI Consultant below for instant qualification &amp; custom proposals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={() => {
              // Open chatbot widget if present
              const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open Cynbit AI Assistant"]');
              if (btn) btn.click();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Bot className="h-4 w-4" />
            <span>Launch AI Qualification Chatbot</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <a href="#services">
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800 text-sm font-semibold h-[48px]"
            >
              <span>Explore Cynbit Services</span>
            </Button>
          </a>
        </motion.div>

        {/* Key Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-4 backdrop-blur-md"
        >
          <div className="p-2">
            <span className="block text-2xl font-extrabold text-white">99.2%</span>
            <span className="text-xs text-zinc-400">Lead Scoring Precision</span>
          </div>
          <div className="p-2 border-l border-zinc-800/80">
            <span className="block text-2xl font-extrabold text-cyan-400">&lt; 2 Mins</span>
            <span className="text-xs text-zinc-400">Consultation to Scope</span>
          </div>
          <div className="p-2 border-l border-zinc-800/80">
            <span className="block text-2xl font-extrabold text-emerald-400">5 Pillars</span>
            <span className="text-xs text-zinc-400">Comprehensive IT Tech</span>
          </div>
          <div className="p-2 border-l border-zinc-800/80">
            <span className="block text-2xl font-extrabold text-indigo-400">24 / 7</span>
            <span className="text-xs text-zinc-400">AI Autonomous Inbound</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
