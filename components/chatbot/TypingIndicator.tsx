"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 my-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20">
        <Bot className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-2.5 text-zinc-300 shadow-sm backdrop-blur-sm">
        <span className="text-xs text-zinc-400 font-medium mr-1.5">Analyzing</span>
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-cyan-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        />
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-cyan-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-blue-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
}
