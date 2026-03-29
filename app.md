# Rockefeller Flutter App Integration Blueprint

## Build Directive

This file is the implementation guide for the Flutter mobile app.
Use the backend API as the single source of truth for all production data.
Do not keep separate mock models for live features.

## Product Mission

Rockefeller helps mine teams detect hazards early, submit field incidents quickly, and coordinate response with full traceability.

Core pillars:
- Monitoring
- Incident capture
- Escalation and notifications
- Forecast-aware planning
- Historical analysis

## Flutter Stack (Recommended)

- Flutter 3.22+
- Dart 3+
- dio for REST calls
- flutter_secure_storage for token storage
- riverpod or bloc for state management
- go_router for routing
- websocket_channel for realtime notifications
- json_serializable or freezed for typed models

## Backend Connection

Use these base URLs:

- Local backend: http://localhost:8000
- Railway backend: https://rockefeller-production.up.railway.app

Health check:
- GET /api/health

Expected response:

```json
{
	"status": "ok",
	"version": "2.0.0"
}
```

## Auth Integration

Login endpoint:
- POST /api/auth/login

Request:

```json
{
	"email": "admin@geoalert.com",
	"password": "admin123"
}
```

Response shape:

```json
{
	"access_token": "<jwt>",
	"token_type": "bearer",
	"user": {
		"id": "...",
		"name": "...",
		"email": "...",
		"role": "admin|safety_officer|field_worker",
		"district": "...",
		"zone_assigned": "...",
		"avatar_url": "..."
	}
}
```

Token usage:
- Add header Authorization: Bearer <token> on protected calls.
- Rehydrate session with GET /api/auth/me on app startup.

## Realtime Notifications

WebSocket endpoint:
- /ws/{user_id}?token=<jwt>

Event payload shape:

```json
{
	"event": "notification",
	"notification": {
		"id": "...",
		"user_id": "...",
		"title": "...",
		"message": "...",
		"zone_id": "...",
		"zone_name": "...",
		"type": "alert|info|warning",
		"is_read": false,
		"created_at": "2026-03-29T..."
	}
}
```

Reconnect policy:
- Auto reconnect with backoff.
- Re-fetch notification list after reconnect.

## Backend Data Sources by Feature

### Dashboard and Map
- GET /api/zones
- GET /api/risk-levels
- GET /api/alerts

### Zone Detail
- GET /api/zones/{id}
- GET /api/zones/{id}/forecast
- GET /api/alerts?zone_id={id}

### Alerts
- GET /api/alerts
- PATCH /api/alerts/{id}/acknowledge
- PATCH /api/alerts/{id}/resolve

### Crack Reports
- GET /api/crack-reports
- GET /api/crack-reports/{report_id}
- POST /api/crack-reports
- PATCH /api/crack-reports/{report_id}/verify
- PATCH /api/crack-reports/{report_id}/reject
- PATCH /api/crack-reports/{report_id}/notify-critical

### Field Reports
- GET /api/reports
- GET /api/reports/{report_id}
- POST /api/reports
- POST /api/reports/generate-ai-draft

### Presence and Emergency
- PATCH /api/presence/me/check-in
- PATCH /api/presence/me/check-out
- GET /api/presence/headcount
- POST /api/emergency/broadcast

### Forecast and History
- GET /api/rainfall/forecast/{district}
- GET /api/rainfall/zone-risk-flags
- GET /api/history

## Core Data Structure Contracts

### User (API)

```json
{
	"id": "string",
	"name": "string",
	"email": "string",
	"role": "admin|safety_officer|field_worker",
	"district": "string|null",
	"zone_assigned": "string|null",
	"worker_id": "string|null",
	"phone": "string|null",
	"avatar_url": "string|null"
}
```

### Zone

```json
{
	"id": "string",
	"name": "string",
	"district": "string",
	"mine_name": "string",
	"risk_level": "green|yellow|orange|red",
	"risk_score": 0.42,
	"status": "monitoring|...",
	"latlngs": []
}
```

### Alert

```json
{
	"id": "string",
	"zone_id": "string",
	"zone_name": "string",
	"district": "string",
	"risk_level": "green|yellow|orange|red",
	"trigger_reason": "string",
	"status": "active|acknowledged|resolved",
	"created_at": "ISO timestamp"
}
```

### Crack Report

```json
{
	"id": "string",
	"zone_id": "string",
	"zone_name": "string",
	"reported_by": "string",
	"crack_type": "string",
	"severity": "low|moderate|high|critical",
	"ai_severity_class": "string|null",
	"ai_risk_score": 0.6,
	"confidence": 0.87,
	"critical_crack_flag": 0,
	"photo_url": "/uploads/crack_reports/<file>",
	"status": "pending|ai_scored|verified|rejected|reviewed|closed",
	"created_at": "ISO timestamp"
}
```

### Field Report

```json
{
	"id": "string",
	"zone_id": "string",
	"zone_name": "string",
	"reported_by": "string",
	"photo_url": "/uploads/reports/<file>|null",
	"severity": "low|medium|high|critical",
	"remarks": "string|null",
	"review_status": "pending|reviewed|false_alarm|critical",
	"created_at": "ISO timestamp"
}
```

## Multipart Submission Structures

### Crack report submission

Endpoint:
- POST /api/crack-reports

Form fields:
- zone_id (required)
- crack_type
- severity
- remarks
- submission_mode (ai or admin)
- coords (json string optional)
- photo (required)

AI mode returns ai_summary with fields:

```json
{
	"ai_severity_class": "high",
	"ai_risk_score": 0.60,
	"confidence": 0.87,
	"critical_crack_flag": 0,
	"note": "AI score generated and forwarded to admin review queue."
}
```

### Field report submission

Endpoint:
- POST /api/reports

Form fields:
- zone_id (required)
- severity
- remarks
- reported_by
- photo (optional)

## AI Draft Generation for Field Report

Endpoint:
- POST /api/reports/generate-ai-draft

Request body:

```json
{
	"zone_id": "...",
	"zone_name": "...",
	"report_type": "visual_inspection",
	"severity": "medium",
	"title": "...",
	"description": "...",
	"observations": "...",
	"location_detail": "...",
	"weather_condition": "cloudy"
}
```

Response body:

```json
{
	"draft": {
		"title": "...",
		"description": "...",
		"observations": "...",
		"remarks": "...",
		"severity": "low|medium|high|critical",
		"source": "gemini|fallback"
	},
	"generated_at": "ISO timestamp",
	"generated_for": "User Name"
}
```

## Error Handling Contract

Most backend errors return:

```json
{
	"detail": "Error message"
}
```

Flutter UI requirements:
- Show actionable error text from detail.
- Retry option for network failures.
- Handle 401 by clearing token and redirecting to login.
- Handle 403 by showing permission message.

## Security and Reliability Rules

- Never store JWT in shared preferences plain text.
- Use secure storage for token.
- Enforce role checks server side, not just client UI.
- Reconnect websocket automatically on disconnect.
- Keep screens usable when one API call fails (partial rendering).

## Backend Environment Requirements

Backend .env must include at least:
- MONGODB_URL
- DATABASE_NAME
- SECRET_KEY
- ALGORITHM
- CORS_ORIGINS
- GEMINI_API_KEY
- GEMINI_MODEL
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_CLAIMS_SUBJECT

## Flutter Delivery Checklist

- Login and session restore works.
- Zone list, alerts, crack reports, field reports load from backend.
- Crack submission supports both modes (ai and admin).
- Admin can open crack detail and perform review actions.
- Critical notify action works from crack review.
- Field report AI draft generation fills form.
- Websocket notifications appear in app without refresh.
- All protected endpoints send bearer token.
