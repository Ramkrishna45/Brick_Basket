# Brick Basket 🧱

**Brick Basket** is a highly scalable, B2C home construction management platform designed to centralize project workflows, financial milestone tracking, and client communication into a beautiful, highly responsive user interface.

![Brick Basket Demo](https://images.unsplash.com/photo-1541888081622-19e0789d970a?q=80&w=1200)

---

## 🌟 Key Features

* **Strict Role-Based Access Control (RBAC):** Supports 4 distinct user tiers with complete UI and API route isolation:
  * **Admins:** Full control over users, projects, leads, global notifications, and financials.
  * **Customers:** Beautiful dashboards to view their personal project progress, milestone payments, receipts, and important documents.
  * **Engineers & Contractors:** Dedicated portals to upload daily progress reports with photos, track their assigned projects, and communicate with clients.
* **Automated Waterfall Payment System:** A custom algorithmic payment distributor. When a payment is recorded, the system intelligently allocates the incoming transaction across pending project milestones, completely replacing manual ledger entry.
* **Next-Gen Authentication:** Fully secured by **Auth.js (NextAuth v5)**. Supports both traditional Credentials login (Email/Password) and seamless **Google OAuth** with intelligent automatic account linking to prevent duplicate user profiles.
* **Real-time Progress Tracking:** Engineers can upload daily updates with a dynamic completion slider. Powered by **Supabase S3-compatible cloud storage** for fast, reliable, and secure image and document hosting.
* **Modern, Dynamic UI:** A visually stunning frontend built with **Tailwind CSS**, **Shadcn UI** components, and **Framer Motion** for micro-animations and smooth page transitions.

---

## 💻 Tech Stack

### Frontend
* **[Next.js 15](https://nextjs.org/)** (App Router, React Server Components, Server Actions)
* **[React 19](https://react.dev/)**
* **[Tailwind CSS](https://tailwindcss.com/)** for utility-first styling.
* **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)** / **[Base UI](https://base-ui.com/)** for accessible, customizable components.
* **[Framer Motion](https://www.framer.com/motion/)** for complex layout animations.

### Backend & Database
* **[PostgreSQL](https://www.postgresql.org/)** as the primary relational database.
* **[Prisma ORM](https://www.prisma.io/)** for type-safe database querying and schema migrations.
* **[Supabase Storage](https://supabase.com/docs/guides/storage)** for cloud-based file/image hosting.
* **[NextAuth.js (v5)](https://authjs.dev/)** for secure JWT session management and OAuth.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/Ramkrishna45/Brick_Basket.git
cd Brick_Basket/brick-basket
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (inside `brick-basket`) and configure the following variables:

```env
# Postgres Database connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/brickbasket?schema=public"

# Auth.js Configuration
AUTH_SECRET="generate-a-random-32-character-secret-here"

# Google OAuth Configuration
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Supabase Storage Configuration (For Progress Photos & Documents)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Database Setup
Push the Prisma schema to your PostgreSQL database to create the necessary tables:
```bash
npx prisma db push
```

*(Optional)* If you want to seed the database with an initial Admin account and dummy data, you can run:
```bash
npx prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── (admin)/          # Admin Dashboard routes
│   ├── (dashboard)/      # Customer Dashboard routes
│   ├── (public)/         # Public marketing pages & auth
│   ├── staff/            # Engineer & Contractor routes
│   └── api/              # API routes (Auth, Webhooks, etc.)
├── components/           # Reusable React components
│   ├── admin/            # Admin specific UI components
│   ├── shared/           # Cross-role components (e.g. ProjectDetailsView)
│   └── ui/               # Shadcn UI primitives
├── lib/                  # Utilities and Backend Logic
│   ├── actions/          # Next.js Server Actions (Database mutations)
│   ├── auth.ts           # NextAuth v5 configuration
│   └── db.ts             # Prisma Client singleton
└── prisma/
    └── schema.prisma     # Relational database schema
```

---

## 🔒 Security & Architecture Notes

- **Server Actions:** All database mutations are handled securely via React Server Actions, ensuring sensitive logic is executed on the server.
- **Payload Limits:** The platform features strict client-side file size validation to respect Vercel's 4.5MB Server Action payload limit, gracefully handling edge-case large files.
- **Data Fetching:** Heavily utilizes React Server Components (RSC) to fetch data directly on the server without shipping heavy JS bundles to the client, improving SEO and initial page load times.
- **Account Linking:** If an existing user logs in with Google OAuth using the same email address, the system securely bypasses standard OAuth blocks and intelligently links the accounts.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
