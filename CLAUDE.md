# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3333
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Production server on port 3333
```

## Architecture

This is a Next.js 15 portfolio site with Supabase backend for blog functionality.

### Tech Stack
- Next.js 15.5.7 (App Router) with React 18
- Tailwind CSS v4 beta with `@tailwindcss/postcss`
- Supabase for authentication and blog storage
- Radix UI primitives via shadcn/ui components

### Key Directories
- `app/` - Next.js App Router pages
- `components/` - React components (section components + shadcn/ui in `ui/`)
- `lib/supabase/` - Supabase client utilities (server.ts, client.ts, proxy.ts)
- `supabase/schema.sql` - Database schema for blogs table

### Pages Structure
- `/` - Homepage with sections: Hero, About, Experience, Skills, Achievements, Contact
- `/blogs` - Blog listing (fetches from Supabase)
- `/blogs/[slug]` - Individual blog post
- `/admin` - Blog management (requires auth)
- `/auth/login` - Authentication

### Navigation Pattern
Navigation links use absolute paths (`/#about`, `/#experience`) to ensure proper routing from any page back to homepage sections.

## Supabase Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run `supabase/schema.sql` in Supabase SQL Editor to create the blogs table with RLS policies.
