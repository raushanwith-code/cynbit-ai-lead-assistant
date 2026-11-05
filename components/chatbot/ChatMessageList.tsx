"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";
import { IChatMessage, ILead } from "@/types";
import { LeadProposalCard } from "./LeadProposalCard";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageListProps {
  messages: IChatMessage[];
  isTyping: boolean;
  onLeadConfirmed?: (lead: ILead) => void;
}

export function ChatMessageList({ messages, isTyping, onLeadConfirmed }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Formatter for simple markdown (bold, lists)
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-cyan-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-md ${
                  isUser
                    ? "bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20"
                    : "bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-cyan-500/20"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "rounded-tr-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/15"
                      : "rounded-tl-sm bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 shadow-sm backdrop-blur-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{renderMessageContent(message.content)}</p>
                </div>

                {/* If Lead Proposal Card is triggered */}
                {message.isProposal && message.leadProposalData && (
                  <LeadProposalCard
                    leadData={message.leadProposalData}
                    onConfirmSuccess={onLeadConfirmed}
                  />
                )}

                {/* Timestamp */}
                <span className="mt-1 block text-[10px] text-zinc-500 px-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
