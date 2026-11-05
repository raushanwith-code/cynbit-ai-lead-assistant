"use client";

import React from "react";
import { Bot, X, RotateCcw, Volume2, VolumeX, ShieldCheck } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function ChatHeader({ onClose, onReset, soundEnabled, onToggleSound }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 px-4 py-3 text-white">
      {/* Brand & Status */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25">
            <Bot className="h-5 w-5" />
          </div>
          {/* Pulsing online status indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold tracking-tight text-white">Cynbit AI</h3>
            <span className="rounded bg-cyan-950/80 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-400 border border-cyan-800/40">
              PRO
            </span>
          </div>
          <p className="flex items-center gap-1 text-[11px] text-zinc-400">
            <ShieldCheck className="h-3 w-3 text-cyan-400" />
            <span>Lead Qualification Specialist</span>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? "Mute audio" : "Enable audio"}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Restart Conversation"
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          title="Minimize Chat"
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
