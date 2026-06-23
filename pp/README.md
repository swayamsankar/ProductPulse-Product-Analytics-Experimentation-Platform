# ProductPulse — Full-Stack Product Analytics

React + Vite (TypeScript) frontend with the full Lovable design system, plus Node/Express/MongoDB backend.

## Structure
```
productpulse/
├── client/   # React 18 + Vite + TS + Tailwind v4 + shadcn/ui + Recharts + React Router
└── server/   # Express + Mongoose + JWT + Multer (CSV upload)
```

## Quick start

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # edit MONGODB_URI / JWT_SECRET
npm run seed             # demo user + sample events
npm run dev              # http://localhost:5000
```
Demo login: `demo@productpulse.io` / `demo1234`

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env     # default API points at http://localhost:5000/api
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`.

## Design system
- Tailwind v4 (CSS-first via `src/styles.css`) with full ProductPulse tokens (oklch palette, gradients, shadows, dark navy sidebar tokens).
- shadcn/ui primitives in `src/components/ui/*`.
- `AppSidebar` with active blue pill, mobile drawer, responsive breakpoints.
- Landing page hero with gradient, mockup, feature grid, CTA.

## Pages
- `/` Landing
- `/auth` Sign in / Sign up (real, hits `/api/auth/*`)
- `/dashboard` KPIs + DAU/Revenue/Sessions/Features charts
- `/funnel` Funnel + step breakdown
- `/retention` Cohort heatmap (sticky cohort col on mobile)
- `/features` Adoption bar chart + table
- `/experiments` A/B variants + significance
- `/upload` CSV upload (drag & drop)
- `/insights` AI-style insight cards

## API endpoints (server)
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | { name, email, password } |
| POST | /api/auth/login | { email, password } → { token, user } |
| GET  | /api/auth/me | current user |
| POST | /api/events | log event |
| GET  | /api/analytics/kpis | DAU, MAU, conversion, retention |
| GET  | /api/analytics/funnel?steps=signup,activate,purchase | |
| GET  | /api/analytics/retention | cohort matrix |
| GET  | /api/analytics/features | adoption rates |
| GET  | /api/experiments | list A/B tests |
| POST | /api/upload/csv | multipart CSV upload |

<!-- Testing -->
KPI API ✅,Funnel API ✅,Retention API ✅,Feature Adoption API ✅,Experiments API ✅
