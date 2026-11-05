"use client";

import React from "react";
import { Bot, Globe, Smartphone, Cloud, Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { CynbitService } from "@/types";

interface ServiceItem {
  id: CynbitService;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  techStack: string[];
  gradient: string;
  borderHover: string;
  popular?: boolean;
}

const CYNBIT_SERVICES: ServiceItem[] = [
  {
    id: "AI Automation",
    title: "AI Automation",
    tagline: "Autonomous Agentic Workflows & Custom LLM Integrations",
    icon: Bot,
    popular: true,
    features: [
      "Custom Enterprise Knowledge Bases & RAG Pipelines",
      "Multi-Agent Workflow Orchestration",
      "Document Intelligence & Ingestion Pipelines",
      "Autonomous Customer Underwriting Bots",
    ],
    techStack: ["Enterprise LLMs", "LangChain", "FastAPI", "Pinecone", "Next.js"],
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderHover: "hover:border-cyan-400/50",
  },
  {
    id: "Web Development",
    title: "Web Development",
    tagline: "High-Performance Full-Stack Next.js SaaS Platforms",
    icon: Globe,
    features: [
      "Next.js 15 App Router & Server Components",
      "Tailwind CSS & shadcn/ui Design Systems",
      "E-Commerce & Subscription Billing Platforms",
      "Sub-second Core Web Vitals & Technical SEO",
    ],
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "MongoDB", "PostgreSQL"],
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    borderHover: "hover:border-blue-400/50",
  },
  {
    id: "Mobile App Development",
    title: "Mobile App Development",
    tagline: "Native-Speed Cross-Platform iOS & Android Apps",
    icon: Smartphone,
    features: [
      "React Native & Flutter Hybrid Engineering",
      "Offline-First SQLite & Sync Architecture",
      "Hardware Sensor, Bluetooth & GPS Tracking",
      "Apple App Store & Google Play Launch",
    ],
    techStack: ["React Native", "Flutter", "TypeScript", "Firebase", "Node.js"],
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    borderHover: "hover:border-indigo-400/50",
  },
  {
    id: "Cloud Solutions",
    title: "Cloud Solutions",
    tagline: "Resilient Cloud Architecture, DevOps & Migration",
    icon: Cloud,
    features: [
      "AWS, Azure & Google Cloud Migration",
      "Kubernetes & Docker Microservices Orchestration",
      "Automated CI/CD Pipelines with GitHub Actions",
      "Infrastructure-as-Code via Terraform",
    ],
    techStack: ["AWS", "Docker", "Kubernetes", "Terraform", "Serverless"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-400/50",
  },
  {
    id: "Technical Consulting",
    title: "Technical Consulting",
    tagline: "Enterprise Architecture Audits & Strategic Roadmaps",
    icon: Compass,
    features: [
      "System Architecture & Scalability Audits",
      "AI Readiness & Feasibility Assessments",
      "Security Hardening & SOC2 / HIPAA Compliance",
      "Interim CTO & Engineering Leadership",
    ],
    techStack: ["Architecture Blueprints", "Code Audits", "Security Reviews", "Tech Due Diligence"],
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderHover: "hover:border-purple-400/50",
  },
];

export function ServicesShowcase() {
  const triggerChat = (_serviceTitle?: string) => {
    const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open Cynbit AI Assistant"]');
    if (btn) btn.click();
  };

  return (
    <section id="services" className="py-20 border-t border-zinc-800/80 bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Core Service Pillars
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored Engineering for Modern Scale
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            From proof-of-concept AI agents to enterprise-grade web and cloud migrations,
            Cynbit Technologies executes with engineering precision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CYNBIT_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md transition-all duration-300 ${srv.borderHover} hover:-translate-y-1`}
              >
                {/* Glow on hover */}
                <div
                  className={`absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${srv.gradient} blur-2xl group-hover:scale-125 transition-transform`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/90 text-cyan-400 border border-zinc-700/60 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    {srv.popular && (
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                        Most Requested
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 font-medium">{srv.tagline}</p>

                  {/* Features */}
                  <ul className="mt-5 space-y-2 text-xs text-zinc-300">
                    {srv.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {srv.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-zinc-950/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  type="button"
                  onClick={() => triggerChat(srv.title)}
                  className="mt-6 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <span>Consult Cynbit AI on {srv.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
