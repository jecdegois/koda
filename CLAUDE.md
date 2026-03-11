# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Koda** — a personal finance manager built with Next.js 16, React 19, TypeScript, Supabase (PostgreSQL + Auth), and Tailwind CSS 4. The app tracks incomes (ingresos), expenses (gastos), and custom currencies (monedas) per user, with multi-currency conversion.

## Commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server (http://localhost:3000)
pnpm build         # Production build (TypeScript errors are ignored by next.config.mjs)
pnpm lint          # Run ESLint
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

### Routing

All active routes live under `app/[locale]/` (e.g. `/es/dashboard`, `/en/auth/login`). The `middleware.ts` refreshes Supabase sessions on every request. Locales: `es` (default) and `en`, powered by `next-intl`.

There are legacy routes at `app/dashboard/` and `app/auth/` — the canonical routes are the `[locale]` variants.

### Data Layer

Two patterns are used together:

1. **SWR hooks** (`lib/hooks/use*.ts`) — client-side fetching via the browser Supabase client. Used by all dashboard components. After mutations, call `mutate()` to trigger revalidation.
2. **Server Actions** (`lib/actions/*.ts`) — `'use server'` functions that use the server Supabase client and call `revalidatePath()` after writes.

Supabase clients:
- `lib/supabase/client.ts` — browser (use in `'use client'` components/hooks)
- `lib/supabase/server.ts` — server (use in Server Components and Server Actions)
- `lib/supabase/proxy.ts` — middleware session refresh only

### Database Schema

Tables: `profiles`, `monedas`, `ingresos`, `gastos`. All tables use Row Level Security (RLS) — users only see their own rows.

The `monedas` table stores custom exchange rates per user. The `precio` field means: **how many units of the base currency equal 1 unit of this currency** (e.g., if base is BS and 1 USD = 500 BS, then `precio = 500`).

One moneda is designated as the base currency (`is_base = true` on the profile or similar flag — see `scripts/005_add_base_currency.sql`).

### Adding a New Entity

1. Add SQL migration to `scripts/` and run it in Supabase SQL Editor
2. Create a SWR hook in `lib/hooks/`
3. Create server actions in `lib/actions/`
4. Create a form component in `components/forms/`
5. Create a list component in `components/dashboard/`
6. Add translation keys to both `messages/es.json` and `messages/en.json`

### Internationalization

All user-facing strings use `next-intl`. In client components: `const t = useTranslations()`. In server components: `import { getTranslations } from 'next-intl/server'`. Always add keys to both `messages/es.json` and `messages/en.json`.

### UI Components

`components/ui/` contains shadcn/ui components — do not edit these manually, use the shadcn CLI if adding new ones. Business components live in `components/dashboard/` and `components/forms/`.

## Specs (Especificaciones)

When generating planning specifications (specs) before implementing complex changes or refactors:
1. Create the spec file inside the `specs/` directory.
2. The file must follow the naming convention: `[XX]_[nombre_del_spec].md` where `[XX]` is an incremental zero-padded number (e.g. `00_refactor_entities.md`, `01_add_auth_flow.md`).
3. Specs should define the database schema changes, entities, features, or architecture plans required to fulfill the user's request.
4. Obtain user approval on the spec before proceeding with implementation.

## Spec Execution & Status Tracking

To avoid context loss during long spec executions across multiple sessions:
1. Create a status tracker file inside `.agents/spec_execution/status/` using the naming convention `[XX]_[nombre_del_spec]_status.md`.
2. Break down the approved spec into a detailed task list with checkboxes (e.g., `- [ ] Task 1`).
3. Organize tasks into logical phases (e.g., Phase 1: Database, Phase 2: Data Layer, Phase 3: UI).
4. Update the tracker (changing `[ ]` to `[x]`) as you complete tasks.
5. If the session ends, instruct the user to start a new session and point the agent to the status file to resume work exactly where it was left off.
