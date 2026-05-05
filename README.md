#  Study Group Finder — TU/e

A full-stack web app where TU/e students can create, browse, and join study sessions. Post a session, share the course and location, and other students can join in real time — no page refresh needed.

![Next.js](https://img.shields.io/badge/Next.js_15-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)

---
## Live Demo

[study-group-finder-omega.vercel.app](https://study-group-finder-omega.vercel.app)

> **Note:** The live demo may be temporarily unavailable as the database is on Supabase's free tier and pauses during periods of inactivity.

## What It Does

- **Sign up / log in** with email and password
- **Browse** upcoming study sessions in a live feed
- **Create** a session — set the course, date, time, location, and description
- **Join or leave** any session with one click
- **Real-time updates** — when someone joins or creates a session, everyone sees it instantly
- **Delete your own sessions** when plans change
- **1-month session limit** — sessions can only be scheduled up to 30 days out to keep the feed relevant
- **Route protection** — unauthenticated users are redirected to login

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 15 (App Router)             |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS                        |
| Database      | Supabase (PostgreSQL)               |
| Auth          | Supabase Auth (email/password)      |
| Real-time     | Supabase Realtime (WebSockets)      |
| Deployment    | Vercel                              |

## Project Structure

```
study-group-finder/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SessionCard.tsx
│   │   ├── SessionFeed.tsx
│   │   ├── CreateSessionForm.tsx
│   │   └── AuthForm.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── proxy.ts
│   ├── types/
│   │   └── index.ts
│   └──proxy.ts
├── .env.local
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo

```bash
git clone git@github.com:YOUR-USERNAME/study-group-finder.git
cd study-group-finder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Create a new project on [supabase.com](https://supabase.com). Go to **Settings → API** and copy your Project URL and anon public key.

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create the database tables

Go to the **SQL Editor** in your Supabase dashboard, paste the contents of [`schema.sql`](schema.sql), and click **Run**. This creates the `profiles`, `sessions`, and `session_participants` tables with Row Level Security policies and a trigger that auto-creates profiles on signup.

### 5. Configure auth redirects

In your Supabase dashboard → **Authentication → URL Configuration**:
- Set **Site URL** to `http://localhost:3000`
- Add `http://localhost:3000/auth/callback` to **Redirect URLs**

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account to start.

## Database Schema

**profiles** — public user data, auto-created on signup via database trigger

**sessions** — study sessions with title, description, location, date, and a foreign key to the creator

**session_participants** — join table linking users to sessions (many-to-many), with a unique constraint preventing duplicate joins

All tables use Row Level Security. Users can only create sessions as themselves, join/leave as themselves, and delete sessions they created.

## What I Learned

This was my first full-stack app with a real backend. Key concepts I picked up:

- **Relational databases** — foreign keys, join tables, many-to-many relationships
- **Authentication** — signup/login flows, session tokens via cookies, middleware-based route protection
- **Row Level Security** — database-level authorization that works regardless of how the API is called
- **Real-time subscriptions** — WebSocket channels that push database changes to the client
- **Server vs. client components** — the Next.js App Router pattern of doing auth on the server and interactivity on the client
- **Three Supabase clients** — browser, server, and middleware each need their own client because they run in different environments with different cookie access

## Future Improvements

- [ ] Course filtering (search/filter sessions by course name)
- [ ] Room dropdown ( Standarized room data) 
- [ ] Room-based scheduling with conflict prevention (requires standardized room data)
- [ ] Participant limit per session
- [ ] OAuth login (Google / GitHub)
- [ ] Session comments for participants to coordinate
- [ ] User profile pictures via Supabase Storage


