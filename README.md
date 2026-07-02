# Brick Basket 🧱 — Enterprise Home Construction Management Platform

**Brick Basket** is a highly scalable, production-ready B2C construction management SaaS platform designed to completely digitize and centralize project workflows, complex financial milestone tracking, and client communication into a unified, responsive interface.

![Brick Basket Demo](https://images.unsplash.com/photo-1541888081622-19e0789d970a?q=80&w=1200)

> *Built to handle the heavy lifting of construction management—from lead generation to final handover.*

---

## 📑 Table of Contents

- [Core Architecture & Tech Stack](#-core-architecture--tech-stack)
- [Deep Dive: Key Features](#-deep-dive-key-features)
  - [1. Intelligent Role-Based Access Control (RBAC)](#1-intelligent-role-based-access-control-rbac)
  - [2. Algorithmic Waterfall Payment Distribution](#2-algorithmic-waterfall-payment-distribution)
  - [3. Supabase Cloud Storage Pipeline](#3-supabase-cloud-storage-pipeline)
  - [4. Seamless NextAuth Identity Management](#4-seamless-nextauth-identity-management)
- [Database Schema & Entity Relations](#-database-schema--entity-relations)
- [Development Setup Guide](#-development-setup-guide)
- [Environment Configuration](#-environment-configuration)
- [Deployment & CI/CD](#-deployment--cicd)
- [Security & Performance Optimizations](#-security--performance-optimizations)
- [License](#-license)

---

## 🏗 Core Architecture & Tech Stack

The platform embraces a modern server-first philosophy utilizing **Next.js App Router** and **React Server Components (RSC)** to ship minimal JavaScript to the client while maximizing database query speed.

### Frontend
* **[Next.js 15](https://nextjs.org/)**: Utilizing App Router, React Server Components (RSC), and Server Actions for fluid, JavaScript-light data mutations.
* **[React 19](https://react.dev/)**: Leveraging the latest concurrent features.
* **[Tailwind CSS](https://tailwindcss.com/)**: For rapid, utility-first UI styling.
* **[Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)**: Headless UI components ensuring full ARIA compliance and accessibility.
* **[Framer Motion](https://www.framer.com/motion/)**: Orchestrating complex layout transitions, micro-animations, and dynamic feedback states.

### Backend & Infrastructure
* **[PostgreSQL](https://www.postgresql.org/)**: Primary relational database.
* **[Prisma ORM](https://www.prisma.io/)**: Type-safe database querying, strict schema definitions, and seamless migration handling.
* **[Supabase Storage](https://supabase.com/docs/guides/storage)**: S3-compatible cloud bucket integration for highly secure, low-latency media distribution.
* **[Auth.js (NextAuth v5)](https://authjs.dev/)**: Next-generation authentication managing secure JWTs, session cookies, and multi-provider identity resolution.

---

## 🚀 Deep Dive: Key Features

### 1. Intelligent Role-Based Access Control (RBAC)
The platform strictly enforces route and data isolation across 4 distinct tenant tiers using middleware and server-side validation:
* **Admin / Management:** Full system oversight. Can assign staff, approve financial transactions, manage incoming construction leads, and broadcast system-wide notifications.
* **Customers:** Provided with a beautiful, read-only consumer dashboard to monitor real-time daily progress, download receipts, view upcoming payment milestones, and message their assigned engineers.
* **Engineers & Contractors:** Dedicated operational portals. Restricted to viewing only their assigned projects. They can upload daily visual progress reports, update construction stages, and adjust overall project completion sliders.

### 2. Algorithmic Waterfall Payment Distribution
To eliminate manual bookkeeping errors, the platform features a custom **Waterfall Payment Engine**:
1. When a payment (via UPI, Bank Transfer, Card, Cash) is recorded by an Admin, the system logs the transaction against the project ledger.
2. The algorithm automatically fetches all pending milestones sorted chronologically by creation date.
3. It recursively applies the incoming payment amount to the oldest unpaid milestone.
4. If a milestone is only partially satisfied, it is marked as `partial`. If satisfied, it is marked `paid`, and the remaining funds seamlessly cascade to the next upcoming milestone.

### 3. Supabase Cloud Storage Pipeline
Construction demands heavy visual documentation. We engineered a robust media pipeline:
* **Direct-to-Cloud Uploads:** Photos are uploaded securely to a Supabase bucket via Next.js Server Actions.
* **Payload Limit Handling:** To respect strict serverless limits (e.g., Vercel's 4.5MB payload cap), the frontend performs rigorous client-side byte validation and MIME-type checking before initiating the network request, ensuring the app never hangs on oversized smartphone camera uploads.
* **Dynamic Media Rendering:** Images are served back to the client securely with caching layers in place.

### 4. Seamless NextAuth Identity Management
We integrated a frictionless onboarding system:
* Supports standard encrypted `bcryptjs` Email & Password authentication.
* Fully integrated **Google OAuth** workflow.
* **Intelligent Account Linking:** If a user registers via email, and later attempts to log in via Google with the same email, the system safely bypasses standard "OAuthAccountNotLinked" restrictions, seamlessly merging the identities to prevent duplicate database rows.

---

## 🗄 Database Schema & Entity Relations

The database is built for complex project hierarchies. Below is a high-level representation of our Prisma Schema architecture:

```mermaid
erDiagram
    USER ||--o{ PROJECT : "Is Customer"
    USER ||--o{ PROJECT : "Is Assigned Staff"
    USER ||--o{ PAYMENT_TRANSACTION : "Records"
    
    PROJECT ||--o{ MILESTONE : "Has"
    PROJECT ||--o{ PROGRESS_UPDATE : "Tracks"
    PROJECT ||--o{ DOCUMENT : "Stores"
    
    PROJECT {
        string id PK
        string name
        string currentStage
        int completionPercentage
        float totalValue
        float amountPaid
        string status
    }
    
    MILESTONE {
        string id PK
        string title
        float amount
        float paidAmount
        string status
    }
    
    PROGRESS_UPDATE {
        string id PK
        string description
        string photos
        int completionPercentage
    }
```

---

## 🛠 Development Setup Guide

### 1. Clone & Install
```bash
git clone https://github.com/Ramkrishna45/Brick_Basket.git
cd Brick_Basket/brick-basket
npm install
```

### 2. Environment Configuration
Create a `.env` file at the root of `brick-basket` and provide your secrets:

```env
# -------------------------------------------------
# 1. DATABASE
# -------------------------------------------------
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/brickbasket?schema=public"

# -------------------------------------------------
# 2. AUTHENTICATION (Auth.js)
# -------------------------------------------------
# Generate via: openssl rand -base64 32
AUTH_SECRET="your-32-char-random-secret"

# Google OAuth Credentials (from Google Cloud Console)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# -------------------------------------------------
# 3. CLOUD STORAGE (Supabase)
# -------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Database Initialization
Synchronize the Prisma schema with your Postgres instance:
```bash
npx prisma generate
npx prisma db push
```

*(Optional)* Seed the database with default roles and a master admin account:
```bash
npx prisma db seed
```

### 4. Run the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🌐 Deployment & CI/CD

Brick Basket is heavily optimized for **Vercel** deployment:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Dashboard, navigate to **Settings > Environment Variables** and paste all variables from your local `.env`.
3. For Google OAuth to work in production, ensure you add your live Vercel domain to the **Authorized redirect URIs** in your Google Cloud Console:
   `https://your-domain.vercel.app/api/auth/callback/google`
4. Deploy! Vercel will automatically build the Next.js app and cache static routes.

---

## 🛡 Security & Performance Optimizations

* **Server-Side Rendering (SSR):** Sensitive project financials are fetched exclusively on the server, ensuring financial data is never exposed in client-side bundles.
* **Component-level Suspense:** Heavy data-fetching widgets are wrapped in `<Suspense>` boundaries with skeleton loaders, ensuring the initial HTML paints instantly while data streams in.
* **Prisma Connection Pooling:** Utilizes connection pooling via serverless functions to prevent database connection exhaustion during traffic spikes.
* **Zod Form Validation:** All complex forms (payment modals, progress updates) utilize React Hook Form paired with Zod schemas to ensure strict type safety and input sanitization before hitting the database.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
