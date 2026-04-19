# MineSafe AI - Rockefeller Mine Safety Platform

[![Frontend Live](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)](https://rockefeller-jade.vercel.app)
[![Backend Live](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway)](https://rockefeller-production.up.railway.app)
[![API Health](https://img.shields.io/badge/API-Health-green)](https://rockefeller-production.up.railway.app/api/health)

Production-ready mine safety platform for crack monitoring, zone risk analytics, field reporting, and real-time emergency communication.

## Live Deployments

- Frontend (Vercel): https://rockefeller-jade.vercel.app
- Backend (Railway): https://rockefeller-production.up.railway.app
- API Health: https://rockefeller-production.up.railway.app/api/health

## What This Platform Does

- Predicts landslide and rockfall risk at zone level.
- Visualizes zone risk on interactive map views.
- Supports crack reporting with photo evidence and AI-assisted analysis.
- Sends critical notifications to mapped workers.
- Tracks blasts, exploration logs, and rainfall forecasts.
- Provides role-aware workflows for admin, safety officer, and field worker.

## Key Features

### Risk Intelligence
- Multi-factor risk scoring using rainfall, slope, blast activity, and historic patterns.
- ML-backed prediction flow with fallback strategy for resilience.
- District rainfall forecasting and proactive risk flags.

### Crack Operations
- Crack report submission with image upload.
- AI-assisted technical remark drafting.
- Crack details now support:
  - Generate with AI
  - Generate with Grok
- Admin verify / safe / reject workflow with notification routing.

### Realtime Communication
- In-app notifications
- WebSocket updates
- Browser push subscriptions

### Operations Data
- Blast telemetry and anomaly detection
- Exploration logs and saturation tracking
- Dashboard trend panels and operational KPIs

## Tech Stack

### Frontend
- React 18 + Vite
- Deck.gl + MapLibre + React Leaflet
- Recharts + Framer Motion
- Axios

### Backend
- FastAPI
- MongoDB + Beanie ODM
- JWT authentication
- WebSocket and push notification services

### AI / ML
- XGBoost (risk model)
- Prophet (rainfall forecast)
- Keras CNN (crack image model)
- Isolation Forest (blast anomaly)
- Groq LLM integration (drafting and explanation)

## Architecture

```text
Frontend (React/Vite)
        |
        v
Backend (FastAPI)
        |
        +--> MongoDB (operational data)
        +--> ML models (risk, crack, forecast, anomaly)
        +--> Realtime layer (WebSocket + push)
```

## Repository Structure

```text
src/                  React frontend
backend/app/          FastAPI routes, models, services
backend/scripts/      Seed and maintenance scripts
dataset/              Model data and artifacts
uploads/              Uploaded media
```

## Local Development Setup

## 1) Frontend

```bash
npm install
npm run dev
```

Frontend dev URL:
- http://localhost:5173

## 2) Backend

```bash
cd backend
python -m venv env
# Windows PowerShell
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend dev URL:
- http://127.0.0.1:8000

## 3) Optional Seed

```bash
cd backend
python scripts/seed_db.py
```

## Environment Variables

## Backend (backend/.env)

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=rockefeller
SECRET_KEY=change_this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
CORS_ORIGINS=http://localhost:5173,https://rockefeller-jade.vercel.app,https://rockefeller-production.up.railway.app
CORS_ORIGIN_REGEX=^https://([a-z0-9-]+\.)?vercel\.app$

# AI keys
GROQ_API_KEY=
GEMINI_API_KEY=

# Push notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_CLAIMS_SUBJECT=mailto:admin@rockefeller.local

# Model paths
MODEL_ARTIFACTS_DIR=
CRACK_MODEL_PATH=
CRACK_MODEL_URL=
MODEL_CACHE_DIR=runtime_models
MODEL_DOWNLOAD_TIMEOUT_SEC=30
```

## Frontend (root .env for production)

```env
VITE_API_URL=https://rockefeller-production.up.railway.app
VITE_API_FALLBACK_URL=https://rockefeller-production.up.railway.app
VITE_MAPTILER_KEY=your_maptiler_key
```

## Frontend (root .env.local for local dev)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_MAPTILER_KEY=your_maptiler_key
```

## Deployment Guide

## A) Railway Backend Deployment

Service settings:
- Root Directory: backend
- Build Command: pip install -r requirements.txt
- Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Required Railway variables:
- MONGODB_URL
- DATABASE_NAME
- SECRET_KEY
- ALGORITHM
- CORS_ORIGINS
- CORS_ORIGIN_REGEX
- GROQ_API_KEY (if using Grok generation)

Recommended optional variables:
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_CLAIMS_SUBJECT
- MODEL_ARTIFACTS_DIR or CRACK_MODEL_URL

After setting variables:
1. Trigger redeploy in Railway.
2. Open health endpoint and confirm 200:
   - https://rockefeller-production.up.railway.app/api/health

## B) Vercel Frontend Deployment

Project settings:
- Framework preset: Vite
- Root Directory: rockefeller
- Build Command: npm run build
- Output Directory: dist

Required Vercel variable:
- VITE_API_URL=https://rockefeller-production.up.railway.app

Recommended Vercel variables:
- VITE_API_FALLBACK_URL=https://rockefeller-production.up.railway.app
- VITE_MAPTILER_KEY=your_maptiler_key

After setting variables:
1. Redeploy on Vercel.
2. Verify frontend loads and API calls succeed:
   - https://rockefeller-jade.vercel.app

## CORS Checklist for Vercel + Railway

- CORS_ORIGINS must include your exact production Vercel URL.
- Keep CORS_ORIGIN_REGEX enabled for preview deployments.
- Redeploy backend after changing CORS values.

## Post-Deployment Smoke Test

1. Open frontend and log in.
2. Confirm dashboard data loads.
3. Open Crack Reports and submit one test record.
4. In crack details, test both tabs:
   - Generate with AI
   - Generate with Grok
5. Confirm report appears in admin view.
6. Confirm notifications route correctly for critical actions.

## API Highlights

Authentication:
- POST /api/auth/login
- GET /api/auth/me

Reports:
- GET /api/reports
- POST /api/reports
- POST /api/reports/generate-ai-draft

Crack Reports:
- GET /api/crack-reports
- POST /api/crack-reports
- PATCH /api/crack-reports/{id}/verify
- PATCH /api/crack-reports/{id}/notify-critical
- PATCH /api/crack-reports/{id}/reject

Groq:
- POST /api/groq/zones/{zone_id}/summary
- POST /api/groq/alerts/{alert_id}/explain
- POST /api/groq/crack-remarks

## How to Show Vercel Link in GitHub

If you want the Vercel link to be visible directly in GitHub repository UI:

1. Open your repository on GitHub.
2. In the right side About panel, click the settings icon.
3. Add Website URL:
   - https://rockefeller-jade.vercel.app
4. Save.

Now the website link appears on the repository sidebar.

Also do these for better visibility:
- Keep the Live Deployments section at top of README.
- Keep the Vercel badge (already added).
- Connect Vercel GitHub integration so each commit shows deployment status checks.

Important note:
- git remote -v only shows Git remotes (GitHub URL), not hosting URLs.
- Vercel URL is shown in GitHub About/README/Deployments, not as a Git remote.

## Troubleshooting

- Login fails:
  - Check backend token secret and backend URL in frontend env.
- Frontend cannot call backend:
  - Verify CORS_ORIGINS and redeploy backend.
- Map zones not visible:
  - Confirm /api/zones returns latlngs data for each zone.
- Grok generation fails:
  - Verify GROQ_API_KEY in Railway.

## Security Notes

- Never commit real API keys.
- Keep .env and .env.* ignored.
- Rotate keys immediately if exposed.

## License

Private internal project for operational and educational use.
