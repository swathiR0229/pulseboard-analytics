# PulseBoard Analytics

A lightweight analytics dashboard with KPI cards, trend visualization, range filtering, and simulated event ingestion.
GitHub Profile: https://github.com/swathiR0229
Repository: https://github.com/swathiR0229/pulseboard-analytics

## Features
- KPI cards: signups, sales, revenue, conversion
- Date-range filter (7/14/30 days)
- Canvas-based revenue trend chart (no chart library required)
- Backend endpoint to simulate new daily event data
- API-backed table for daily metrics

## Tech
- HTML/CSS/Vanilla JS
- Node.js + Express
- JSON event storage (`data/events.json`)

## Run
```bash
npm install
npm start
```
Open `http://localhost:3002`.

## Endpoints
- `GET /api/health`
- `GET /api/metrics?days=7`
- `POST /api/events/simulate`

## Why this helps freelance profile
Shows product-style dashboard skills frequently requested by remote SaaS teams.
