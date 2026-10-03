# Vaidya — Family care desk

A multi-page demo app for a hackathon video. Eight AI agents keep a family's medicines, payments, deliveries and records on track.

## Quick start — demo mode (no backend needed)

```bash
cd vaidya-ui
npm install
npm run dev
```

Open http://localhost:5173. Click **Demo mode** in the top bar, then go to **Live run** and press **Play full demo**.

## Pages

| Route | Page |
|---|---|
| `/` | Desk (home) — KPIs, patients, recent ledger |
| `/live` | Live run — command centre with pipeline stepper |
| `/team` | Team — 8 agent cards with drawer |
| `/refill` | Refill detail — timeline, escrow diagram, ship tracker |
| `/money` | Money — care reserve, transactions, controls |
| `/safety` | Safety — verdict mix, red flag log, rules |
| `/records` | Records — report timeline, 38s stopwatch |
| `/family` | Family — members, WhatsApp-style group chat |
| `/insights` | Insights — 6 charts with takeaways |
| `/arch` | Architecture — system diagram |
| `/settings` | Settings — autonomy, quiet hours, contacts |

## Switching to the live backend

### 1. Start the Python backend

```bash
cd Vaidya
pip install fastapi uvicorn sse-starlette
python server.py
# Serves on http://localhost:8001
```

### 2. Set the env var and restart the frontend

```bash
cd vaidya-ui
VITE_API_URL=http://localhost:8001 npm run dev
```

Or create a `.env.local` file in `vaidya-ui/`:

```
VITE_API_URL=http://localhost:8001
```

When `VITE_API_URL` is set:
- `GET /state` feeds patients, reserve, items
- `GET /ledger` loads all historical rows  
- `GET /events` SSE stream runs all 5 scenarios and streams rows in real time

The top bar shows **LIVE** instead of **MOCK** when connected.

## Backend API shapes

### Ledger row
```json
{ "t": "18:27:09", "agent": "coord", "msg": "...", "evidence": "...", "kind": "ok" }
```

### Reserve
```json
{ "available": 2500, "hold": 840, "released": 1540 }
```

### Patient
```json
{ "key": "papa", "name": "Papa", "district": "Amritsar", "med": "Metformin",
  "strength": "500mg", "qty": 60, "days_left": 4.2, "owner": "Rishikesh", "backup": "Neha" }
```

## Seed data

| Item | Value |
|---|---|
| Care reserve | Rs 2,500 |
| Papa stock | 4.2 days |
| Maa stock | 5 days |
| Sharma Medicos | Rs 840 (Amritsar) |
| Lakshmi Medicals | Rs 700 (Krishna) |
| Approved recipient | Dr. Kapoor |

## Design system

Neo-brutalism: flat, loud, honest. 3px solid borders, hard offset shadows. Paper background with 24px dot grid. Space Grotesk + Space Mono. No gradients. All money data carries a **SANDBOX** sticker.
