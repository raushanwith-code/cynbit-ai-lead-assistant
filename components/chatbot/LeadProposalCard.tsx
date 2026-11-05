"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, ShieldCheck, ArrowRight, Loader2, Code, Zap } from "lucide-react";
import { ILead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeadProposalCardProps {
  leadData: Partial<ILead>;
  onConfirmSuccess?: (savedLead: ILead) => void;
}

export function LeadProposalCard({ leadData, onConfirmSuccess }: LeadProposalCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const priorityVariant =
    leadData.leadScore === "High" ? "high" : leadData.leadScore === "Medium" ? "medium" : "low";

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsConfirmed(true);
        setConfirmedId(data.lead.id || data.lead._id);

        // Confetti burst
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#06b6d4", "#3b82f6", "#6366f1", "#10b981"],
        });

        if (onConfirmSuccess) {
          onConfirmSuccess(data.lead);
        }
      } else {
        alert("Could not save lead: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting lead proposal:", err);
      alert("Submission error. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 p-3.5 shadow-xl shadow-cyan-950/30 backdrop-blur-md">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cynbit Solution Blueprint</span>
          </div>
          <h4 className="mt-0.5 text-base font-bold text-white">
            {leadData.serviceRecommended || "AI Automation"}
          </h4>
        </div>
        <Badge variant={priorityVariant as any}>
          {leadData.leadScore || "Medium"} Priority
        </Badge>
      </div>

      {/* Key Details Grid */}
      <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/60">
          <span className="text-zinc-400 block text-[10px] uppercase font-medium">Declared Budget</span>
          <span className="font-semibold text-emerald-400">{leadData.budget || "₹50k - ₹1 Lakh"}</span>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/60">
          <span className="text-zinc-400 block text-[10px] uppercase font-medium">Timeline Target</span>
          <span className="font-semibold text-zinc-200">{leadData.timeline || "1-2 Months"}</span>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/60">
          <span className="text-zinc-400 block text-[10px] uppercase font-medium">Client / Org</span>
          <span className="font-semibold text-zinc-200 truncate block">
            {leadData.name || "Client"} ({leadData.businessType || "Startup"})
          </span>
        </div>
        <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/60">
          <span className="text-zinc-400 block text-[10px] uppercase font-medium">Email Dispatch</span>
          <span className="font-semibold text-cyan-300 truncate block">{leadData.email || "Pending"}</span>
        </div>
      </div>

      {/* AI Rationale */}
      {leadData.aiAnalysis?.rationale && (
        <div className="mb-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30 p-2 text-[11px] text-cyan-100/90 leading-relaxed">
          <div className="flex items-center gap-1 font-semibold text-cyan-300 mb-0.5">
            <Zap className="h-3 w-3" />
            <span>AI Match Rationale</span>
          </div>
          {leadData.aiAnalysis.rationale}
        </div>
      )}

      {/* Recommended Tech Stack Pills */}
      {leadData.aiAnalysis?.suggestedTechStack && leadData.aiAnalysis.suggestedTechStack.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-zinc-400 mb-1">
            <Code className="h-3 w-3" />
            <span>Recommended Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {leadData.aiAnalysis.suggestedTechStack.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="rounded bg-zinc-800/90 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Call to action */}
      {isConfirmed ? (
        <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/40 p-2.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Proposal Locked & Transmitted</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-300">
            Ref ID: <span className="font-mono text-cyan-300">{confirmedId}</span>. Cynbit&apos;s Solution Architect
            will contact you at <span className="text-white underline">{leadData.email}</span> within 2 hours.
          </p>
        </div>
      ) : (
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting || !leadData.email}
          className="w-full text-xs font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-cyan-500/25 h-9"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Locking In Cynbit Scope...
            </>
          ) : (
            <>
              Confirm & Request Detailed Proposal
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
