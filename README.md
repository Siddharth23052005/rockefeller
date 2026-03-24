# Rockefeller Mine Safety Dashboard

Rockefeller is a full-stack mine safety monitoring platform for Maharashtra operations. It combines live risk zones, alerts, reports, crack analysis, and administrative controls in a React dashboard backed by FastAPI.

## Features

- Role-based authentication (admin, safety officer, field worker)
- Interactive map with risk-based zone visualization
- Alert management and status tracking
- Crack report and field report workflows
- Blast logging with anomaly detection
- District rainfall forecasting and proactive zone risk forecasting
- Analytics views and admin management panel

## Tech Stack

### Frontend

- React 18 + Vite
- Material UI (MUI)
- React Router
- Recharts
- Leaflet / React-Leaflet
- Axios
- Framer Motion
- react-loading-skeleton

### Backend

- FastAPI
- Beanie ODM / MongoDB models
- JWT authentication
- Pydantic schemas
- XGBoost (Model 2)
- Prophet (Model 3)
- scikit-learn IsolationForest (Model 4)

## ML Model Integration (Rockefeller)

Backend integrates three models through `backend/app/services/ml_models.py`:

- Model 2 (zone risk classifier): predicts risk label and risk score from 11 zone and event features.
- Model 3 (district rainfall forecast): Prophet district-level daily rainfall forecasts.
- Model 4 (blast anomaly detector): flags anomalous blast events with anomaly score and severity.

### Startup behavior

- ML models are preloaded on API startup via `preload_models()` for Model 2 and Model 4.
- Daily proactive forecast job runs on startup via `run_daily_risk_forecast()`.
- District Prophet models are loaded on demand per district.

## Dataset Placement

Place `dataset/` at workspace root (same level as `backend/`) or under `backend/dataset/`.

Expected files include:

- `model2_model.pkl`
- `model2_scaler.pkl`
- `model2_encoder.pkl`
- `model4_blast_anomaly.pkl`
- `model3_district_models/*.pkl`

## API Endpoints Powered by Models

- `POST /api/crack-reports`: creates crack report and triggers Model 2 risk update flow.
- `POST /api/blast-events`: runs Model 4 anomaly detection and creates an alert for anomalies.
- `GET /api/rainfall/forecast/{district}`: returns Prophet rainfall forecast.
- `GET /api/zones/{zone_id}/forecast`: combines Model 3 (tomorrow rain) + Model 2 (predicted zone risk).
- `PATCH /api/crack-reports/{report_id}/review`: officer/admin review override workflow.

## Project Structure

- `src/`: Frontend application
- `backend/app/`: FastAPI backend source
- `backend/scripts/data/`: Seed/mock JSON data
- `dataset/`: ML models and reference datasets

## Prerequisites

- Node.js 18+
- Python 3.10+
- pip
- Running MongoDB instance (required by backend)

## Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start frontend dev server:

```bash
npm run dev
```

Frontend runs on Vite default port (usually 5173).

## Backend Setup

1. Open a terminal in backend folder:

```bash
cd backend
```

2. Create and activate virtual environment (if needed):

```bash
python -m venv env
.\env\Scripts\activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Start API server:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

## Requirements Notes

Key backend ML dependencies now required:

- `xgboost>=2.0.0`
- `scikit-learn>=1.3.0`
- `prophet>=1.1.5`
- `pandas>=2.0.0`
- `numpy>=1.24.0`

## Authentication Notes

- JWT token is stored in local storage.
- On reload, the app restores the previous session and revalidates the user.
- Use the sidebar logout button to clear session and return to login.

## Common Scripts

### Frontend

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview production build

### Backend

- `uvicorn app.main:app --reload --port 8000` - run API server

## Troubleshooting

- If login fails repeatedly, verify backend is running on port 8000.
- If data pages are empty, verify backend can access MongoDB and seed data.
- If forecast endpoints return model errors, verify `dataset/` contains all required `.pkl` files.
- If map tiles do not load, verify internet access for tile providers.

## License

This project is private and intended for internal development use.
