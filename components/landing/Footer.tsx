"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-bold">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">Cynbit Technologies</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Engineering autonomous AI solutions, cutting-edge web applications, and resilient cloud architectures.
            </p>
            <div className="flex items-center gap-2 text-cyan-400">
              <Globe className="h-3.5 w-3.5" />
              <a href="https://cynbit.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
                https://cynbit.in
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Service Pillars</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">AI Automation &amp; LLMs</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Next.js Web Development</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Mobile App Engineering</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Cloud Architecture &amp; DevOps</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Technical Advisory &amp; Audits</a></li>
            </ul>
          </div>

          {/* Lead Qualification Criteria */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">AI Lead Scoring</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>High Priority: Budget &gt; ₹1 Lakh</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Medium Priority: ₹50k - ₹1 Lakh</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <span>Low Priority: Below ₹50k</span>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Executive Control</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Intelligence Portal</span>
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 block">Default Admin PIN: cynbit2026</span>
              </li>
              <li className="pt-2">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>contact@cynbit.in</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Cynbit Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Enterprise Software &amp; Cloud Engineering • Cynbit Technologies</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
