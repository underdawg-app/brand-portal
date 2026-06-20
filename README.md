# Underdawg — Brand & Agency Web Portal

The brand/agency side of Underdawg — the missing other half of every interaction that, in the
creator mobile app, only exists as a counterparty. Built to **mirror the app's status enums, data
shapes and design language** so the two halves stay in sync.

This is a **separate Next.js project** living beside the React Native app (`../underdawg-app`). It does
**not** touch or depend on the app — it shares only the *contract* (enums + entity field names).

## Run

```bash
npm install      # already done
npm run dev      # http://localhost:3000  (RN app's Metro is on 8081 — no collision)
npm run typecheck
npm run build
```

## What's built (Brand MVP — P0, the full deal loop)

`/dashboard` pipeline kanban + action items · `/discover` creator search + profile drawer (verification-gated
rates/contact) · `/jobs` + `/jobs/new` authoring + `/jobs/[id]` applicant **ATS** · `/deals` +
`/deals/[id]` **workspace** (Overview · Negotiation · Contract e-sign · Deliverables review · Escrow ·
Rating) · `/messages` · `/finance` (escrow ledger, GST invoices) · `/ratings` · `/campaigns` (Get Viral, P1
groundwork) · `/analytics` · `/settings` (team seats + permission grid) · `/styleguide`.

**End-to-end loop you can click through:** Discover → post Job → shortlist/accept applicant (creates a Deal)
→ negotiate → generate + counter-sign contract (executes → funds escrow + activates deal) → approve
deliverable + confirm go-live link → release escrow → rate the creator.

## Architecture

- **Next.js 14 (App Router) + TypeScript + Tailwind**, dark-first, role-aware CSS-var tokens.
- `src/lib/types.ts` — the contract. Canonical enums copied verbatim from the spec; **never rename**.
- `src/lib/store.ts` — Zustand store = the mock backend (seeded from `src/data/seed.ts`). Swap to live
  REST/GraphQL by replacing store actions with API calls; the response shapes already match `types.ts`.
- `src/components/ui/*` — shared kit (Button, StatusBadge, Money, Avatar, DataTable, Kanban, Drawer…).
- `src/components/shell/*` — Topbar (theme toggle + seat switcher) + permission-gated Sidebar.
- Account model: Brand (built) · Agency·Management (P1) · Agency·Marketing (P2). See
  `../underdawg-app/UNDERDAWG_Brand_Agency_Portal_Spec.md` (on Desktop) and
  `../underdawg-app/docs/BRAND_AGENCY_PORTAL_CONTEXT.md`.

## Try the permission grid

Top-right seat switcher → switch from **Aarav (Owner)** to **Dev (Assistant)**: Finance, Analytics and
Campaigns disappear from the nav (Dev lacks `viewFinancials` / `viewAnalytics` / `manageCampaigns`).

## Not yet built (later phases)

Agency portals (roster/representation/commission for Management; multi-client for Marketing), real Razorpay/
Stripe/Digio integrations, WebSocket realtime, brand sign-up/KYC flow screens, cross-client analytics.
