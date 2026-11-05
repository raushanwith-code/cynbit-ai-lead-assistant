"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, X } from "lucide-react";
import { IChatMessage, ILead } from "@/types";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";

const INITIAL_MESSAGES: IChatMessage[] = [
  {
    id: "msg_welcome",
    role: "assistant",
    content:
      "Hello! Welcome to **Cynbit Technologies** (https://cynbit.in). I'm your AI Solutions Architect.\n\nI can help qualify your project, estimate costs, and recommend whether **AI Automation**, **Web Development**, **Mobile App Development**, **Cloud Solutions**, or **Technical Consulting** is best for your business.\n\nWhat kind of solution or system are you looking to build?",
    timestamp: new Date().toISOString(),
    suggestions: [
      "AI Automation & LLM Workflows",
      "Full Stack Next.js Web Platform",
      "iOS & Android Mobile App",
      "Cloud Architecture & DevOps",
      "Technical Advisory & Audit",
    ],
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLead, setCurrentLead] = useState<Partial<ILead>>({});
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    "AI Automation & LLM Workflows",
    "Full Stack Next.js Web Platform",
    "iOS & Android Mobile App",
    "Cloud Architecture & DevOps",
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(1);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cynbit_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setUnreadCount(0);
        }
      }
      const savedLead = localStorage.getItem("cynbit_lead_state");
      if (savedLead) {
        setCurrentLead(JSON.parse(savedLead));
      }
    } catch (e) {
      console.warn("Could not load local chat cache:", e);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("cynbit_chat_history", JSON.stringify(messages));
      }
      if (Object.keys(currentLead).length > 0) {
        localStorage.setItem("cynbit_lead_state", JSON.stringify(currentLead));
      }
    } catch (e) {
      console.warn("Could not save local chat cache:", e);
    }
  }, [messages, currentLead]);

  // Audio tone generator (Web Audio API synth)
  const playSound = (type: "send" | "receive") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      if (type === "send") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext might be blocked before first interaction
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    playSound("send");

    const userMessage: IChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);
    setCurrentSuggestions([]);

    try {
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          currentLeadData: currentLead,
        }),
      });

      const data = await res.json();

      setIsTyping(false);
      playSound("receive");

      if (res.ok && data.reply) {
        const newLeadState = { ...currentLead, ...data.extractedLead };
        setCurrentLead(newLeadState);

        const botMessage: IChatMessage = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toISOString(),
          isProposal: Boolean(data.isQualified),
          leadProposalData: data.isQualified ? newLeadState : undefined,
          suggestions: data.suggestions || [],
        };

        setMessages((prev) => [...prev, botMessage]);
        setCurrentSuggestions(data.suggestions || []);

        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_err_${Date.now()}`,
            role: "assistant",
            content: "I apologize, I experienced a minor network hitch. Could you repeat that or share your budget range?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: "assistant",
          content: "Network issue connecting to Cynbit AI engine. Please verify your connection.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleResetChat = () => {
    if (confirm("Reset chat and start a new consultation?")) {
      setMessages(INITIAL_MESSAGES);
      setCurrentLead({});
      setCurrentSuggestions([
        "AI Automation & LLM Workflows",
        "Full Stack Next.js Web Platform",
        "iOS & Android Mobile App",
        "Cloud Architecture & DevOps",
      ]);
      localStorage.removeItem("cynbit_chat_history");
      localStorage.removeItem("cynbit_lead_state");
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 flex h-[620px] w-[95vw] max-w-[430px] flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-zinc-950/95 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:h-[650px]"
          >
            <ChatHeader
              onClose={() => setIsOpen(false)}
              onReset={handleResetChat}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((v) => !v)}
            />

            <ChatMessageList
              messages={messages}
              isTyping={isTyping}
              onLeadConfirmed={(saved) => {
                setCurrentLead(saved);
              }}
            />

            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              suggestions={currentSuggestions}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Launcher Button */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-xl shadow-cyan-500/30 ring-1 ring-cyan-400/40 cursor-pointer"
        aria-label="Open Cynbit AI Assistant"
      >
        {/* Glow halo */}
        <span className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />

        {isOpen ? (
          <div className="flex items-center gap-2">
            <X className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold text-sm">Close Chat</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <MessageSquareText className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold text-sm tracking-tight">
              Talk to Cynbit AI
            </span>
            <span className="hidden sm:flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              Instant Scope
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
