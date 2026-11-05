"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { QuickSuggestions } from "./QuickSuggestions";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

export function ChatInput({ onSendMessage, disabled, suggestions }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md">
      <QuickSuggestions
        suggestions={suggestions}
        disabled={disabled}
        onSelect={(suggestion) => onSendMessage(suggestion)}
      />

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Describe your project, budget, or ask Cynbit..."
          className="flex-1 rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </form>
    </div>
  );
}
