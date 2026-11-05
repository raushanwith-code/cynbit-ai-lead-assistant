"use client";

import React from "react";
import { Search, Filter, Eye, AlertCircle, Sparkles } from "lucide-react";
import { ILead, LeadScore, CynbitService, LeadStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatCurrencyINR } from "@/lib/utils/formatters";

interface LeadTableProps {
  leads: ILead[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedScore: LeadScore | "All";
  onScoreChange: (score: LeadScore | "All") => void;
  selectedService: CynbitService | "All";
  onServiceChange: (service: CynbitService | "All") => void;
  selectedStatus: LeadStatus | "All";
  onStatusChangeFilter: (status: LeadStatus | "All") => void;
  onSelectLead: (lead: ILead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

export function LeadTable({
  leads,
  loading,
  searchQuery,
  onSearchChange,
  selectedScore,
  onScoreChange,
  selectedService,
  onServiceChange,
  selectedStatus,
  onStatusChangeFilter,
  onSelectLead,
  onUpdateStatus,
}: LeadTableProps) {
  const getScoreVariant = (score: LeadScore) => {
    switch (score) {
      case "High":
        return "high";
      case "Medium":
        return "medium";
      case "Low":
        return "low";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 bg-zinc-900/40">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, requirement, or service..."
            className="pl-9 h-10 text-xs sm:text-sm bg-zinc-950/60"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Score Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-2.5 py-1.5 text-xs text-zinc-300">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={selectedScore}
              onChange={(e) => onScoreChange(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Scores</option>
              <option value="High" className="bg-zinc-900">High (&gt; ₹1 Lakh)</option>
              <option value="Medium" className="bg-zinc-900">Medium (₹50k-₹1L)</option>
              <option value="Low" className="bg-zinc-900">Low (&lt; ₹50k)</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-2.5 py-1.5 text-xs text-zinc-300">
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Services</option>
              <option value="AI Automation" className="bg-zinc-900">AI Automation</option>
              <option value="Web Development" className="bg-zinc-900">Web Development</option>
              <option value="Mobile App Development" className="bg-zinc-900">Mobile Apps</option>
              <option value="Cloud Solutions" className="bg-zinc-900">Cloud & DevOps</option>
              <option value="Technical Consulting" className="bg-zinc-900">Tech Consulting</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-2.5 py-1.5 text-xs text-zinc-300">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChangeFilter(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Statuses</option>
              <option value="New" className="bg-zinc-900">New</option>
              <option value="Contacted" className="bg-zinc-900">Contacted</option>
              <option value="Proposal Sent" className="bg-zinc-900">Proposal Sent</option>
              <option value="Qualified" className="bg-zinc-900">Qualified</option>
              <option value="Closed" className="bg-zinc-900">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-zinc-800 bg-zinc-950/50 text-[11px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3.5 font-semibold">Client / Business</th>
              <th className="px-4 py-3.5 font-semibold">Recommended Service</th>
              <th className="px-4 py-3.5 font-semibold">Lead Priority</th>
              <th className="px-4 py-3.5 font-semibold">Budget</th>
              <th className="px-4 py-3.5 font-semibold">Timeline</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Date Captured</th>
              <th className="px-4 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span>Loading Cynbit leads intelligence...</span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                  <AlertCircle className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">No matching leads found</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Try adjusting your search criteria or score filters.</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const id = lead.id || lead._id || "";
                return (
                  <tr
                    key={id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Client info */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[160px]">{lead.email}</div>
                      <div className="text-[10px] text-zinc-500">{lead.businessType}</div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-cyan-300">{lead.serviceRecommended}</span>
                    </td>

                    {/* Lead Score */}
                    <td className="px-4 py-3.5">
                      <Badge variant={getScoreVariant(lead.leadScore) as any}>
                        {lead.leadScore}
                      </Badge>
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-emerald-400">{lead.budget}</div>
                      <div className="text-[10px] text-zinc-500">{formatCurrencyINR(lead.budgetAmount)}</div>
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-3.5 text-zinc-300">
                      {lead.timeline}
                    </td>

                    {/* Status updater */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(id, e.target.value as LeadStatus)}
                        className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-zinc-400 text-[11px]">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/80 px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/40 px-4 py-2.5 text-xs text-zinc-400">
        <span>Showing {leads.length} qualified opportunities</span>
        <span className="flex items-center gap-1 text-cyan-400">
          <Sparkles className="h-3 w-3" />
          Powered by Cynbit AI Engine
        </span>
      </div>
    </div>
  );
}
