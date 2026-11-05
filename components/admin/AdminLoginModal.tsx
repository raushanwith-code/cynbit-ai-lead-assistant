"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLoginModalProps {
  onSuccess: (token: string) => void;
}

export function AdminLoginModal({ onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem("cynbit_admin_token", data.token);
        onSuccess(data.token);
      } else {
        setError(data.error || "Invalid Cynbit Admin credentials");
      }
    } catch {
      setError("Network error authenticating. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
            Cynbit Technologies
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            AI Lead Intelligence Command Center • Restricted Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Admin Access PIN / Password
            </label>
            <div className="relative">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (default: cynbit2026)"
                className="pl-10"
                autoFocus
              />
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Default password: <code className="text-cyan-400 font-mono">cynbit2026</code> (configured via ADMIN_PASSWORD)
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full h-11 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                Access Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
