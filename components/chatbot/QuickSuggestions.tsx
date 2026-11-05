"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface QuickSuggestionsProps {
  suggestions?: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export function QuickSuggestions({ suggestions = [], onSelect, disabled }: QuickSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-zinc-800/80 bg-zinc-950/40">
      <div className="w-full flex items-center gap-1 text-[11px] font-medium text-cyan-400/80 mb-0.5">
        <Sparkles className="h-3 w-3" />
        <span>Suggested Replies:</span>
      </div>
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 text-xs text-cyan-200 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/40 hover:text-white active:scale-95 disabled:opacity-50 text-left cursor-pointer"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
