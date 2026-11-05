# 🤖 Cynbit AI Lead Qualification Chatbot & Admin Intelligence Platform

> Production-ready AI-powered conversational lead qualification, service classification, and real-time sales intelligence system engineered for **[Cynbit Technologies](https://cynbit.in)**.

---

## 🌟 Executive Overview

Website visitors often browse IT services without knowing which solution best fits their business model, architecture, and budget. This platform solves that challenge by deploying an autonomous **AI Solutions Consultant** directly on the website that:

1. **Understands complex user requirements** through consultative, natural dialog powered by the **Google Gemini API**.
2. **Qualifies leads progressively** across 6 parameters (Name, Email, Business Type, Budget, Project Scope, Timeline).
3. **Recommends the optimal Cynbit Service** from the 5 core pillars:
   - ⚡ **AI Automation**
   - 🌐 **Web Development**
   - 📱 **Mobile App Development**
   - ☁️ **Cloud Solutions**
   - 🧭 **Technical Consulting**
4. **Calculates Lead Priority Scores** deterministically:
   - 🟢 **High Priority**: Budget > ₹1,00,000 (> ₹1 Lakh)
   - 🔵 **Medium Priority**: Budget ₹50,000 – ₹1,00,000 (₹50k – ₹1 Lakh)
   - ⚪ **Low Priority**: Budget < ₹50,000 (< ₹50k)
5. **Generates an interactive in-chat proposal blueprint** with 1-click confirmation, confetti feedback, and instant email dispatch.
6. **Stores qualified leads in MongoDB** with Mongoose schema validation (plus automatic zero-downtime in-memory fallback if MongoDB URI is pending).
7. **Equips sales and engineering executives with an Executive Admin Dashboard** (`/admin`) featuring KPI metrics, visual analytics charts, searchable/filterable lead pipeline, CSV export, and conversation replay.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 15** (App Router, Server & Client Components) |
| **Language** | **TypeScript 5** (Strict mode) |
| **Styling** | **Tailwind CSS v4**, Custom Cyan/Dark Neon SaaS Aesthetic |
| **UI Components** | Custom **shadcn/ui** inspired primitives, **Lucide React** Icons |
| **Animations & FX** | **Framer Motion**, **Canvas Confetti**, Web Audio Synth Chimes |
| **AI Intelligence** | **Google Gemini API** (`@google/generative-ai` 1.5/2.0 Flash) with intelligent rule-based dialog fallback |
| **Database & ODM** | **MongoDB** + **Mongoose** (with singleton connection caching & memory store fallback) |
| **Notifications** | **Nodemailer** (HTML dispatch with simulated logging fallback) |
| **Export Engine** | Custom UTF-8 BOM CSV generator |

---

## 📁 Project Directory Structure

```text
cynbit-ai-chatbot/
├── app/
│   ├── admin/
│   │   └── page.tsx                  # Protected Admin Dashboard (/admin)
│   ├── api/
│   │   ├── admin/
│   │   │   └── auth/
│   │   │       └── route.ts          # Admin session verification (POST)
│   │   ├── chat/
│   │   │   └── route.ts              # Gemini conversational AI engine (POST)
│   │   ├── leads/
│   │   │   ├── export/
│   │   │   │   └── route.ts          # One-click CSV export with headers (GET)
│   │   │   ├── seed/
│   │   │   │   └── route.ts          # Demo lead database seeder (POST)
│   │   │   ├── stats/
│   │   │   │   └── route.ts          # Real-time analytics KPI aggregation (GET)
│   │   │   ├── [id]/
│   │   │   │   └── route.ts          # Single lead GET, PATCH (status), DELETE
│   │   │   └── route.ts              # Leads list GET & Lead capture POST
│   ├── favicon.ico
│   ├── globals.css                   # Dark SaaS theme, glassmorphism, glows
│   ├── layout.tsx                    # Root layout with Cynbit SEO metadata
│   └── page.tsx                      # Cynbit Technologies showcase page
├── components/
│   ├── admin/
│   │   ├── AdminAnalytics.tsx        # Demand, score & pipeline distribution charts
│   │   ├── AdminHeader.tsx           # Command center navigation, clock, actions
│   │   ├── AdminLoginModal.tsx       # Secure access passcode guard
│   │   ├── LeadDetailDrawer.tsx      # Full lead brief, chat replay, action buttons
│   │   ├── LeadTable.tsx             # Searchable, filterable lead pipeline table
│   │   └── StatsCards.tsx            # KPI metric cards (Total, High, Pipeline INR)
│   ├── chatbot/
│   │   ├── ChatHeader.tsx            # Active consultant status, sound & reset
│   │   ├── ChatInput.tsx             # Text input, keyboard handlers, suggestion pills
│   │   ├── ChatMessageList.tsx       # Message list, avatars, proposal embed
│   │   ├── ChatWidget.tsx            # Floating toggle widget with Framer Motion
│   │   ├── LeadProposalCard.tsx      # In-chat interactive qualification card
│   │   ├── QuickSuggestions.tsx      # Interactive context reply chips
│   │   └── TypingIndicator.tsx       # Glowing pulse analyzing indicator
│   ├── landing/
│   │   ├── CynbitHero.tsx            # High-impact hero section
│   │   ├── CynbitNavbar.tsx          # Sleek glassmorphism header
│   │   ├── Footer.tsx                # Footer with service & Cynbit links
│   │   ├── ServicesShowcase.tsx      # 5 Core service pillars grid
│   │   └── Testimonials.tsx          # Enterprise client proof & metrics
│   └── ui/
│       ├── badge.tsx                 # Score & status badges
│       ├── button.tsx                # Gradient & outline buttons
│       ├── card.tsx                  # Glassmorphism cards
│       └── input.tsx                 # Styled inputs
├── lib/
│   ├── ai/
│   │   ├── gemini.ts                 # Gemini API integration & fallback dialog engine
│   │   └── leadClassifier.ts         # Service classification & scoring algorithms
│   ├── db/
│   │   ├── connection.ts             # Mongoose singleton connection manager
│   │   ├── inMemoryStore.ts          # Resilient in-memory mock store
│   │   └── models/
│   │       └── Lead.ts               # Lead Mongoose schema & model
│   ├── email/
│   │   └── notifier.ts               # Nodemailer HTML lead alert dispatcher
│   ├── utils/
│   │   ├── csvExporter.ts            # CSV formatter with UTF-8 BOM
│   │   └── formatters.ts             # INR Currency, dates & budget parser
│   └── utils.ts                      # Tailwind cn helper
├── types/
│   └── index.ts                      # Strict TypeScript interfaces
├── .env.example                      # Documented environment variables template
├── .env.local                        # Local development environment config
├── package.json                      # Dependencies and run scripts
└── tsconfig.json                     # TypeScript compiler configuration
```

---

## 🎯 Lead Qualification Flow & Scoring Rules

### 1. Collected Information
During the consultative interaction, Cynbit AI captures:
- **Client Name**
- **Email Address** (validated for proposals)
- **Phone Number** (optional)
- **Business Type** (`Startup`, `Small / Medium Business`, `Enterprise`, `Agency / Partner`, `Individual`)
- **Budget** (e.g., `< ₹50k`, `₹50k - ₹1 Lakh`, `> ₹1 Lakh`, or custom amount)
- **Project Requirement** (detailed scope / objective)
- **Timeline** (`Immediate < 2 weeks`, `1-2 Months`, `3-6 Months`, `Flexible`)

### 2. Service Classification Matrix
The AI maps requirements to Cynbit's 5 core offerings:
- **AI Automation**: Custom Gemini RAG, LLM agent workflows, automated underwriting, document understanding.
- **Web Development**: Next.js 15 full-stack apps, SaaS platforms, high-conversion e-commerce, custom CMS.
- **Mobile App Development**: React Native / Flutter apps, offline SQLite, GPS fleet tracking.
- **Cloud Solutions**: AWS / Azure / GCP migration, Docker, Kubernetes, automated CI/CD.
- **Technical Consulting**: System architecture review, AI readiness, security audit, CTO advisory.

### 3. Strict Scoring Thresholds
- **High Priority**: Declared budget **> ₹1,00,000 (> ₹1 Lakh)**
- **Medium Priority**: Declared budget **between ₹50,000 and ₹1,00,000 (₹50k - ₹1 Lakh)**
- **Low Priority**: Declared budget **below ₹50,000 (< ₹50k)**

---

## 🗄️ Database Schema (`Lead`)

```typescript
{
  name: string;                   // Client name
  email: string;                  // Work / personal email
  phone?: string;                 // Phone contact
  businessType: string;           // Startup | SME | Enterprise | Agency
  budget: string;                 // Declared budget text (e.g. "₹2.5 Lakhs")
  budgetAmount: number;           // Parsed numeric amount for sorting & analytics
  timeline: string;               // e.g. "1-2 Months"
  projectRequirement: string;     // Requirement description
  message?: string;               // Additional client notes
  serviceRecommended: string;     // One of the 5 Cynbit Service Pillars
  leadScore: "High" | "Medium" | "Low";
  scoreValue?: number;            // 0 - 100 confidence
  status: "New" | "Contacted" | "Proposal Sent" | "Qualified" | "Closed";
  tags: string[];                 // Quick filters
  aiAnalysis: {
    rationale: string;            // Why Cynbit recommended this service
    keyNeeds?: string[];          // Detected technical priorities
    suggestedTechStack?: string[];// e.g. ["Next.js", "Gemini", "FastAPI"]
  };
  chatHistory: {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.18.0 or later (Node v20+ or v24 recommended)
- **npm** or **pnpm** / **yarn**

### 1. Installation
Clone the repository and install dependencies:
```bash
cd cynbit-ai-chatbot
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Optional: Add your Google Gemini API key from https://aistudio.google.com/
# (If omitted, the chatbot runs on its built-in rule-based conversational AI engine)
GEMINI_API_KEY=AIzaSy...

# Optional: Add your MongoDB URI (local or MongoDB Atlas)
# (If omitted, the app operates automatically with its built-in in-memory store)
MONGODB_URI=mongodb://localhost:27017/cynbit_leads

# Admin Dashboard Password (default: cynbit2026)
ADMIN_PASSWORD=cynbit2026
ADMIN_EMAIL=admin@cynbit.in

# Lead Notification Email (Optional SMTP)
NOTIFICATION_EMAIL_TO=sales@cynbit.in
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- **Visitor Showcase & Chatbot**: [http://localhost:3000](http://localhost:3000)
- **Admin Command Center**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Passcode: `cynbit2026`)*

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | AI dialog processing, qualification extraction, service match |
| `POST` | `/api/leads` | Saves new qualified lead, triggers email notification |
| `GET` | `/api/leads` | Fetches filtered leads (`score`, `service`, `status`, `search`) |
| `GET` | `/api/leads/[id]` | Fetches single lead by ID |
| `PATCH`| `/api/leads/[id]` | Updates lead status (`New`, `Contacted`, `Qualified`, etc.) |
| `DELETE`|`/api/leads/[id]`| Deletes a lead record |
| `GET` | `/api/leads/stats`| Live analytics metrics, distributions & daily velocity |
| `GET` | `/api/leads/export`| Generates and downloads formatted CSV export |
| `POST` | `/api/leads/seed` | Seeds realistic sample demo leads for testing |
| `POST` | `/api/admin/auth` | Authenticates admin password and returns session token |

---

## ☁️ Production Deployment Guide

### Deploying to Vercel

1. Push your repository to **GitHub / GitLab**.
2. Go to **[Vercel Dashboard](https://vercel.com)** and click **"Add New Project"**.
3. Import your `cynbit-ai-chatbot` repository.
4. Set Environment Variables in the Vercel project settings:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `MONGODB_URI`: Your MongoDB Atlas cluster connection string.
   - `ADMIN_PASSWORD`: A strong admin passcode.
   - `ADMIN_EMAIL`: `admin@cynbit.in`
   - `NOTIFICATION_EMAIL_TO`: `sales@cynbit.in`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For email notifications.
5. Click **Deploy**. Vercel will build and launch your application globally on Edge/Serverless infrastructure.

---

## 🛡️ Security & Resilience Features

- **Graceful Database Fallback**: If MongoDB is unavailable or unconfigured, the application falls back to an in-memory store so the user experience is never interrupted.
- **Graceful AI Fallback**: If Gemini API limits or network issues arise, the rule-based qualification engine takes over instantly.
- **Audio Feedback**: Subtle Web Audio API synthesis creates modern micro-interactions without loading external audio assets.
- **Admin Route Guard**: Password authentication with session token validation.
- **Sanitized CSV Generation**: Prevents CSV injection formulas and includes UTF-8 BOM for Microsoft Excel compatibility.

---

© 2026 **Cynbit Technologies** • [cynbit.in](https://cynbit.in)
