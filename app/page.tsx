import React from "react";
import { CynbitNavbar } from "@/components/landing/CynbitNavbar";
import { CynbitHero } from "@/components/landing/CynbitHero";
import { ServicesShowcase } from "@/components/landing/ServicesShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <CynbitNavbar />
      <main className="flex-1">
        <CynbitHero />
        <ServicesShowcase />
        <Testimonials />
      </main>
      <Footer />

      {/* Modern Floating AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}
