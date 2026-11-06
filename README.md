# EDM — Enterprise Data Management (Retail & E-Commerce)

A class case study for **IT Elective 4 · Enterprise Data Management**, built as a fullstack
Next.js application. It demonstrates how a retail business unifies **multiple data sources**
(POS terminals, online storefront, warehouses), applies **governance** (audit trail,
change-data-capture style integration events, consent flags), and produces **outputs**
(stock sync, offers, sales analytics) on a single governed data platform.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · **Prisma ORM 7** · **Neon PostgreSQL** · axios · zod

---

## Overview

| Concern | In this project |
| --- | --- |
| Master data | `Customer` (MDM with email de-duplication), `Product` (SKU catalog) |
| Source systems | `PosTransaction` (POS channel), `StorefrontOrder` (web channel) |
| Shared reference | `InventoryItem` — one row per product **per channel** (`POS` \| `WAREHOUSE` \| `STOREFRONT`) |
| Outputs | `Offer` (promo engine), `Shipment` (3PL hand-off with status lifecycle) |
| Integration | `IntegrationEvent` — CDC-style log of what each source produced (source, topic, JSON payload) |
| Governance | `AuditLog` on every mutation, `consentMarketing` flag on customers (GDPR demo) |

Everything is backed by a **Neon PostgreSQL** database (`neondb`) reached through a single,
`globalThis`-cached Prisma client singleton.

## Tools

| Tool | Version | Role |
| --- | --- | --- |
| Next.js | 16.4.5 | Fullstack framework (App Router, API route handlers) |
| React | 19.3 | UI |
| Tailwind CSS | v4 | Styling (CSS-variable theming, no config file) |
| Prisma ORM | 7.10.1 | Typed data layer + migrations (`prisma-client` generator + `@prisma/adapter-pg`) |
| Neon PostgreSQL | — | Managed Postgres (`sslmode=require`, pooler connection) |
| axios | ^1.21.0 | The only HTTP client for API calls (frontend → `/api/v1/*`) |
| zod | ^4.6.7 | Request/input validation schemas (shared by API + forms) |
| lucide-react | — | Icons |

## Features

- **Admin console** (`/admin`) — dashboard KPIs, products, customers, inventory per channel,
  POS sales, online orders, offers, shipments, and a governance page (events + audit).
- **Guest landing page** (`/`) — explains the case study and links into the console.
- **Layered backend**, mirroring the reference Express architecture:
  `app/api/v1/**/route.ts` (thin HTTP) → `repositories/` (typed Prisma queries) → Prisma singleton.
- **Frontend data layer**, mirroring the reference Next.js repo:
  `services/<domain>.service.ts` (axios calls + zod schemas + types) → `lib/axios.ts` singleton.
- **EDM flows implemented**: email de-duplication on customer upsert, per-channel stock
  decrements on checkout, server-side totals (never trust the client), integration events on
  every source transaction, audit log on every mutation, shipment status transitions with
  timestamps (`shippedAt`, `deliveredAt`).
- **Seed data** (`db:seed`) so every page renders with realistic retail demo data.

## Architecture

```
Client components (components/**)
  → services/<domain>.service.ts   (axios + zod + types)
    → lib/axios.ts                 (single axios instance)
      → app/api/v1/**/route.ts     (validate with zod → orchestrate)
        → repositories/*.repository.ts   (the "queries folder", typed Prisma)
          → lib/prisma.ts           (PrismaClient singleton, PrismaPg adapter)
            → Neon PostgreSQL
```

```
lib/                    # axios instance, zod schemas per domain, prisma singleton
prisma/                 # schema.prisma, migrations/, seed.sql
generated/              # Prisma client output (do not edit)
repositories/           # server-side typed queries per entity
services/               # client-side API per domain (axios + zod + types)
components/             # ui/ primitives · common/ · features/<domain>/
app/                    # (guest) landing · admin console · api/v1 endpoints
```

## Getting started

```bash
npm install
# .env already contains DATABASE_URL (Neon connection string) — never commit it
npm run db:generate     # prisma generate
npm run db:migrate      # prisma migrate dev
npm run db:seed         # prisma db execute --file prisma/seed.sql
npm run dev             # http://localhost:3000
```
