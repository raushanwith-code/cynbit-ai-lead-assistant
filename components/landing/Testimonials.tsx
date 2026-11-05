"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      quote:
        "Cynbit automated our entire invoice processing pipeline with custom intelligent automation workflows. What used to take our finance team 4 days now completes in under 20 minutes with 99.8% precision.",
      author: "Rohan Varma",
      role: "VP of Engineering",
      company: "FinFlow Systems",
      score: "High Priority Client",
    },
    {
      quote:
        "The Next.js 15 web platform Cynbit delivered surpassed all our Core Web Vitals targets. Our organic conversions increased by 42% within the first month of deployment.",
      author: "Ananya Iyer",
      role: "Head of Product",
      company: "RetailPulse India",
      score: "Web Development",
    },
    {
      quote:
        "Moving our cloud infrastructure to serverless AWS with automated CI/CD reduced our monthly AWS spend by ₹1.8 Lakhs while handling 5x traffic spikes effortlessly.",
      author: "Siddharth Sen",
      role: "CTO",
      company: "Nexus Logistics",
      score: "Cloud Solutions",
    },
  ];

  return (
    <section id="testimonials" className="py-20 border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Client Success &amp; Engineering Impact
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Ambitious Founders &amp; Tech Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-md"
            >
              <Quote className="h-8 w-8 text-cyan-500/20 mb-3" />
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;{r.quote}&rdquo;
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{r.author}</h4>
                  <p className="text-[11px] text-zinc-400">
                    {r.role}, <span className="text-cyan-400">{r.company}</span>
                  </p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
