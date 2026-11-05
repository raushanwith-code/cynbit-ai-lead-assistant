"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  IndianRupee,
  Cpu,
  Clock,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { ILead, LeadStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";

interface LeadDetailDrawerProps {
  lead: ILead | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
}

export function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
  onDeleteLead,
}: LeadDetailDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const handleCopy = () => {
    const summary = `
CYNBIT LEAD PROFILE
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "N/A"}
Org: ${lead.businessType}
Service: ${lead.serviceRecommended}
Score: ${lead.leadScore} Priority
Budget: ${lead.budget} (${formatCurrencyINR(lead.budgetAmount)})
Timeline: ${lead.timeline}
Requirement: ${lead.projectRequirement}
AI Rationale: ${lead.aiAnalysis?.rationale || "N/A"}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityVariant =
    lead.leadScore === "High" ? "high" : lead.leadScore === "Medium" ? "medium" : "low";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex h-full w-full max-w-2xl flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                <p className="text-xs text-zinc-400">{lead.businessType} • Captured {formatDate(lead.createdAt)}</p>
              </div>
              <Badge variant={priorityVariant as any}>
                {lead.leadScore} Priority
              </Badge>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Status:</span>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id || lead._id || "", e.target.value as LeadStatus)}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs h-8"
                >
                  {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Brief"}
                </Button>

                <a
                  href={`mailto:${lead.email}?subject=Cynbit%20Technologies%20-%20Proposal%20Discussion%20for%20${encodeURIComponent(lead.serviceRecommended)}`}
                  className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm shadow-cyan-500/20"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Email Lead
                </a>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this lead?")) {
                      onDeleteLead(lead.id || lead._id || "");
                      onClose();
                    }
                  }}
                  className="text-xs h-8 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-blue-950/20 to-zinc-900 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>AI Service Qualification</span>
              </div>
              <h4 className="text-xl font-bold text-white">{lead.serviceRecommended}</h4>
              {lead.aiAnalysis?.rationale && (
                <p className="mt-2 text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800">
                  {lead.aiAnalysis.rationale}
                </p>
              )}
            </div>

            {/* Contact & Commercial Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-medium uppercase text-[10px]">Email Address</span>
                </div>
                <span className="text-zinc-100 font-medium block truncate select-all">{lead.email}</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-medium uppercase text-[10px]">Phone Contact</span>
                </div>
                <span className="text-zinc-100 font-medium block">{lead.phone || "Not provided"}</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium uppercase text-[10px]">Budget Declared</span>
                </div>
                <span className="text-emerald-400 font-bold block">
                  {lead.budget} ({formatCurrencyINR(lead.budgetAmount)})
                </span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-medium uppercase text-[10px]">Timeline Requirement</span>
                </div>
                <span className="text-zinc-100 font-medium block">{lead.timeline}</span>
              </div>
            </div>

            {/* Project Requirement */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Project Requirement Scope
              </h5>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {lead.projectRequirement}
              </p>
            </div>

            {/* Suggested Tech Stack */}
            {lead.aiAnalysis?.suggestedTechStack && lead.aiAnalysis.suggestedTechStack.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Proposed Engineering Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lead.aiAnalysis.suggestedTechStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-200 border border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Transcript Replay */}
            {lead.chatHistory && lead.chatHistory.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Chat Conversation Transcript</span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {lead.chatHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                        item.role === "user"
                          ? "bg-cyan-950/30 border border-cyan-800/40 text-cyan-100"
                          : "bg-zinc-800/70 border border-zinc-700/60 text-zinc-300"
                      }`}
                    >
                      <span className="font-bold uppercase text-[10px] block mb-0.5 text-zinc-400">
                        {item.role === "user" ? lead.name : "Cynbit AI"}
                      </span>
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
