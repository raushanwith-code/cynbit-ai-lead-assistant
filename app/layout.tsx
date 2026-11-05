import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cynbit Technologies | AI Solutions, Web & Cloud Engineering",
  description:
    "Cynbit Technologies (cynbit.in) builds enterprise AI automation, modern Next.js web applications, mobile platforms, and resilient cloud infrastructure. Qualify your project with our AI Consultant.",
  keywords: [
    "Cynbit Technologies",
    "AI Automation",
    "Web Development",
    "Mobile App Development",
    "Cloud Solutions",
    "Technical Consulting",
    "Gemini AI",
    "Next.js 15",
  ],
  authors: [{ name: "Cynbit Technologies", url: "https://cynbit.in" }],
  openGraph: {
    title: "Cynbit Technologies | AI Lead Qualification & Engineering",
    description: "Intelligent AI-driven lead qualification and enterprise software engineering.",
    url: "https://cynbit.in",
    siteName: "Cynbit Technologies",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
