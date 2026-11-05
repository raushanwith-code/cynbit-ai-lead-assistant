"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { ILead, ILeadStats, LeadScore, CynbitService, LeadStatus } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const [stats, setStats] = useState<ILeadStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const [leads, setLeads] = useState<ILead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedScore, setSelectedScore] = useState<LeadScore | "All">("All");
  const [selectedService, setSelectedService] = useState<CynbitService | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | "All">("All");

  const [activeLead, setActiveLead] = useState<ILead | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Check existing session token
  useEffect(() => {
    const token = sessionStorage.getItem("cynbit_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetch("/api/leads/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Filtered Leads
  const fetchLeads = useCallback(async () => {
    try {
      setLeadsLoading(true);
      const params = new URLSearchParams();
      if (selectedScore !== "All") params.set("score", selectedScore);
      if (selectedService !== "All") params.set("service", selectedService);
      if (selectedStatus !== "All") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLeadsLoading(false);
    }
  }, [selectedScore, selectedService, selectedStatus, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchLeads();
    }
  }, [isAuthenticated, fetchStats, fetchLeads]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (selectedScore !== "All") params.set("score", selectedScore);
    if (selectedService !== "All") params.set("service", selectedService);

    window.open(`/api/leads/export?${params.toString()}`, "_blank");
  };

  // Handle Seed Demo Data
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/leads/seed", { method: "POST" });
      if (res.ok) {
        await fetchStats();
        await fetchLeads();
      }
    } catch (err) {
      console.error("Failed to seed demo data:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle Lead Status Change
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id || l._id === id ? { ...l, status: newStatus } : l))
        );
        if (activeLead && (activeLead.id === id || activeLead._id === id)) {
          setActiveLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle Delete Lead
  const handleDeleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id && l._id !== id));
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("cynbit_admin_token");
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Authenticating Cynbit Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Login guard */}
      {!isAuthenticated && (
        <AdminLoginModal onSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Main Admin UI */}
      {isAuthenticated && (
        <>
          <AdminHeader
            onExportCSV={handleExportCSV}
            onSeedData={handleSeedData}
            onLogout={handleLogout}
            isSeeding={isSeeding}
          />

          <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 w-full space-y-8">
            {/* KPI Cards */}
            <StatsCards stats={stats} loading={statsLoading} />

            {/* Analytics Dashboard (Bonus Feature) */}
            <AdminAnalytics stats={stats} />

            {/* Lead Intelligence Table */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Inbound Lead Pipeline</h3>
                  <p className="text-xs text-zinc-400">
                    Real-time AI qualified leads captured via Cynbit Website Chatbot
                  </p>
                </div>
              </div>

              <LeadTable
                leads={leads}
                loading={leadsLoading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedScore={selectedScore}
                onScoreChange={setSelectedScore}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
                selectedStatus={selectedStatus}
                onStatusChangeFilter={setSelectedStatus}
                onSelectLead={(lead) => setActiveLead(lead)}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </main>

          {/* Lead Detail Drawer */}
          <LeadDetailDrawer
            lead={activeLead}
            onClose={() => setActiveLead(null)}
            onStatusChange={handleUpdateStatus}
            onDeleteLead={handleDeleteLead}
          />
        </>
      )}
    </div>
  );
}
