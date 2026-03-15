# GeoAlert — Phase 1 Build Plan
## Mine Safety & Landslide Risk Dashboard
### Maharashtra Open-Pit Mines | by JM Solutions

---

## Project Summary

Build a frontend-only, demo-ready mine safety dashboard in React + Vite
for predicting and visualizing slope-failure and landslide risk in 
open-pit mines across Maharashtra, India.

The system uses historical blast data, soil conditions, rainfall, 
landslide records, and field-submitted crack photos to assign risk 
levels (green / yellow / orange / red) to mine zones on an interactive map.

Phase 1 is UI-only with mock data. No backend, no real ML model,
no authentication, no real API calls. All data comes from /src/data/.
The architecture must be scalable so backend and ML can be plugged in
later with minimal changes.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React + Vite (react-swc template)   |
| UI System    | MUI v5 (Material UI)                |
| Map          | React Leaflet v4                    |
| Charts       | Recharts                            |
| Routing      | React Router v6                     |
| State        | React Context (UI only) + local     |
| Data         | Mock JSON files in /src/data/       |
| Future API   | FastAPI (Python) — Phase 2          |
| Future ML    | YOLOv8n-cls for crack analysis      |

---

## Folder Structure

```
src/
  assets/
  components/
    common/
      RiskBadge.jsx
      KpiCard.jsx
      SectionCard.jsx
      DataTable.jsx
      EmptyState.jsx
      LoadingState.jsx
      StatusChip.jsx
    layout/
      AppShell.jsx
      SidebarNav.jsx
      TopHeader.jsx
    map/
      ZoneMap.jsx
      ZonePolygon.jsx
      MapLegend.jsx
      FilterDrawer.jsx
      ZoneDetailsDrawer.jsx
    dashboard/
      KpiRow.jsx
      RiskTrendChart.jsx
      ZoneDistributionChart.jsx
      ActivityFeed.jsx
      RainfallWidget.jsx
    alerts/
      AlertCard.jsx
      AlertList.jsx
    reports/
      ReportCard.jsx
      PhotoGallery.jsx
    upload/
      PhotoUploader.jsx
      UploadPreviewCard.jsx
      CrackTagSelector.jsx
    zones/
      ZoneHeroCard.jsx
      ZoneTabs.jsx
      HistoryTable.jsx
      ZonePhotos.jsx
      WeatherTab.jsx
      RecommendationCards.jsx
    analytics/
      AnalyticsCharts.jsx
    crack/
      CrackReportCard.jsx
      CrackReviewPanel.jsx
      CrackReportList.jsx
  pages/
    Dashboard/
      index.jsx
      useDashboardData.js
    MapView/
      index.jsx
      useMapData.js
    ZoneDetails/
      index.jsx
      useZoneData.js
    Reports/
      index.jsx
    Upload/
      index.jsx
    CrackReports/
      index.jsx
      useCrackData.js
    Alerts/
      index.jsx
    Analytics/
      index.jsx
    Admin/
      index.jsx
    Profile/
      index.jsx
  data/
    zones.js
    alerts.js
    reports.js
    weather.js
    history.js
    crackReports.js
    users.js
  routes/
    router.jsx
  theme/
    index.js
  hooks/
    useRiskColor.js
    useMockData.js
  utils/
    riskUtils.js
    formatUtils.js
  App.jsx
  main.jsx
```

---

## Routes

| Route            | Page Purpose                                        |
|------------------|-----------------------------------------------------|
| /dashboard       | KPI overview, mini map, alerts, charts              |
| /map             | Full interactive risk zone map (hero screen)        |
| /zones/:id       | Deep zone data — tabs for history, photos, weather  |
| /reports         | All field photo reports in list/gallery             |
| /upload          | Worker photo + crack submission form                |
| /crack-reports   | Engineer crack review queue with AI score slots     |
| /alerts          | Active, acknowledged, and historical alerts         |
| /analytics       | Charts — trends, rainfall, blasts, district compare |
| /admin           | Data upload placeholders, thresholds, users         |
| /profile         | User settings, notification toggles                 |

---

## Pages — What Each Must Contain

### /dashboard
- 4 KPI cards: Total Zones, Critical Zones, Active Alerts, Reports Today
- Mini React Leaflet map with color zone polygons (left panel)
- Recent alerts list — last 5 (right panel)
- Rainfall warning widget (current district summary)
- Risk trend line chart — last 30 days mock data
- Zone risk distribution donut chart (green/yellow/orange/red counts)
- Recent activity feed — last 5 events (reports, blast events, zone changes)

### /map (HERO SCREEN — most important page)
- Full-width MapContainer with Maharashtra OpenStreetMap tile layer
- 15 mock zone polygons colored by risk level
- Map legend (bottom-left)
- Collapsible filter drawer (left):
  District, Mine Name, Risk Level (multi-select),
  Soil Type, Rainfall Severity, Date Range
- Zone details drawer (right, opens on polygon click):
  Zone name, mine, district, risk badge + score,
  last landslide date, recent rainfall, blast count 7d,
  slope/soil info, "View Full Details" + "Report Issue" buttons

### /zones/:id
- Hero card: zone name, mine, district, risk badge, score, status, last updated
- Tabs:
  - Overview: 4 info cards (slope, soil, rainfall, blasts) + small local map
  - History: DataTable of past blasts and landslides
  - Photos: PhotoGallery with review status chips
  - Weather: rainfall trend chart + warning level chips
  - Recommendations: action cards (Safe / Monitor / Restrict / Evacuate)

### /reports
- Toggle between list and gallery view
- Filter bar: zone, severity, status, date
- Each report card: photo thumbnail, zone, severity badge, reporter,
  timestamp, review chip, action buttons (View / Verify / Dismiss)
- Summary strip: total / pending / critical counts

### /upload (MUST BE MOBILE-FRIENDLY)
- Drag-and-drop photo upload (JPG/PNG)
- Zone selector (searchable dropdown from zones mock data)
- Crack type tags: Parallel Crack, Perpendicular Crack, 
  Surface Fracture, Tension Crack, Rockfall Sign, Other
- Severity selector: Low / Medium / High / Critical
- Remarks text area
- Coordinate input or map pin picker
- Preview card (right side):
  - Photo thumbnail
  - Selected zone name + current risk level
  - RED warning banner if zone is already Critical
  - "AI Risk Score: Pending" placeholder badge
- Submit with loading and success states
- Stack form + preview vertically on mobile

### /crack-reports (NEW — UNIQUE FEATURE)
- Summary strip: Total submitted / Pending review / AI scored / Confirmed critical
- Filter by zone, severity, crack type, date
- Each crack report card:
  - Original photo thumbnail
  - "AI Annotated" placeholder overlay slot (filled in Phase 2)
  - AI risk score slot: shows "Pending" in Phase 1 (filled by ML in Phase 2)
  - Severity badge (worker-assigned)
  - Crack type tag
  - Zone name + current zone risk color
  - Reporter name + timestamp
  - Status chip: Pending / AI Scored / Confirmed Critical / Safe / False Alarm
  - Engineer action buttons: Confirm Critical | Confirm Safe | False Alarm
- When "Confirm Critical" is clicked:
  - Zone risk level upgrades one color band in mock state (green→yellow, yellow→orange, orange→red)
  - A new mock alert is created and added to the active alerts list
  - The crack report status changes to "Confirmed Critical"
  - A success toast appears: "Zone [name] upgraded to [new level]"
- This simulates the real ML pipeline response — Phase 2 simply replaces
  the mock with a real API call, no UI changes needed

### /alerts
- Tabs: Active | Acknowledged | History
- Each alert card:
  Risk badge, zone name, district, trigger reason,
  timestamp, recommended action, status chip,
  Acknowledge / View on Map / Mark Resolved buttons
- Filter by zone, risk level, date
- Summary count strip: Active: X | Critical: Y | Resolved today: Z

### /analytics
- Incidents by month (bar chart)
- Risk level distribution over time (stacked area chart)
- Blast events vs risk score (scatter plot)
- Rainfall vs incidents dual-axis line chart
- District-wise risk comparison (horizontal bar chart)
- Soil type risk contribution (donut chart)
- Zone heatmap summary table (zone × risk level × color cell)
- Date range picker controlling all charts

### /admin
- Dataset upload cards (UI only, no real upload logic):
  Historical Landslides CSV, Blast Log CSV, Soil Conditions CSV,
  Weather/Rainfall CSV, Mine Zone GeoJSON
- Threshold settings form:
  Yellow threshold (rainfall mm), Orange threshold, Red threshold,
  Blast count escalation threshold
- Zone management table: list, edit, deactivate
- User role management table: name, role chip, assigned zone, status
- Activity log table: recent admin actions

### /profile
- Avatar, name, role, assigned mine, district
- Edit profile form
- Notification preference toggles:
  Active Alerts, Red Zone Entry Warning, New Report, Daily Summary
- Location permission status card
- Password change section

---

## Mock Data — Required Fields

### zones.js (15 zones)
```js
{
  id, name, district, mineName, riskLevel,   // green/yellow/orange/red
  riskScore,                                  // 0-100
  latlngs,                                    // polygon coords array
  soilType, slopeAngle, lastLandslide,
  blastCount7d, recentRainfall,
  status,                                     // Monitoring/Warning/Critical
  lastUpdated
}
```
Districts: Pune, Ratnagiri, Satara, Raigad, Nagpur, Kolhapur

### alerts.js (20 alerts — mix active/acknowledged/resolved)
```js
{
  id, zoneId, zoneName, district, riskLevel,
  triggerReason, timestamp, recommendedAction, status
}
```

### reports.js (20 field reports)
```js
{
  id, image,           // placeholder URL
  zoneId, zoneName, severity, reportedBy,
  timestamp, coords, remarks, reviewStatus
}
```

### crackReports.js (15 crack reports)
```js
{
  id, zoneId, zoneName, photo,         // placeholder URL
  annotatedPhoto,                       // null in Phase 1
  crackType, severity, reportedBy,
  timestamp, coords, remarks,
  aiRiskScore,                          // null in Phase 1
  aiSeverityClass,                      // null in Phase 1
  engineerAction,                       // null until reviewed
  reviewedBy, status,
  zoneColorBefore, zoneColorAfter
}
```

### weather.js (per district)
```js
{
  district, rainfallLast7d, rainfallLast24h,
  warningLevel, trend                   // increasing/stable/decreasing
}
```

### history.js (past events per zone)
```js
{
  id, zoneId, type,    // blast/landslide
  date, magnitude, damageLevel, notes
}
```

### users.js (5 users)
```js
{
  id, name, role,      // Admin/Safety Officer/Field Worker
  avatar, zoneAssigned, district
}
```

---

## Scalability Rules (must follow from day one)

1. NEVER hardcode data inside page components — always read from /src/data/
2. NEVER hardcode risk colors in components — use only riskUtils.js + theme tokens
3. Every shared component accepts props — no internal hardcoded values
4. Each page folder has index.jsx (UI) + usePageData.js (data/logic) — 
   replacing mock with API later changes only usePageData.js
5. React Context only for: current user, dark/light mode, notifications
6. Keep zone data and alert lists local to their pages, not in global context
7. Dynamic import the Map page — React Leaflet is large, lazy load it
8. Name all exports explicitly (named exports, not default-only)
9. No inline styles anywhere — use MUI sx prop or theme tokens only
10. Keep every component file under 200 lines — split if longer

---

## Build Order (layer by layer)

### Layer 1 — Foundation
Vite scaffold → install deps → theme setup → AppShell 
→ all routes with placeholder pages → mock data files → utility files

### Layer 2 — Core screens
Dashboard → Map (full polygon + drawers) 

### Layer 3 — Data screens
Zone Details (tabs) → Analytics (charts)

### Layer 4 — Crack feature (unique differentiator)
Upload page → Crack Reports page → mock zone upgrade logic on confirm

### Layer 5 — Alerts and notifications
Alerts page → notification bell → near-zone mock banner

### Layer 6 — Supporting screens
Admin → Profile → polish, responsiveness, empty states, skeletons

---

## What is NOT in Phase 1

- No real ML inference (crack AI score = null placeholder)
- No real backend or API calls
- No real authentication (mock user from users.js)
- No SMS or email alerts (dashboard UI only)
- No image crack annotation overlay (Phase 2)
- No real geolocation (mock "near zone" banner only)
- No UAV or drone integration (Phase 2)

---

## Phase 2 Integration Points (already designed in Phase 1)

| Phase 1 placeholder             | Phase 2 replacement                        |
|---------------------------------|--------------------------------------------|
| Mock zone data in zones.js      | GET /api/zones from FastAPI                |
| Mock crack score = null         | POST /api/crack-reports → YOLOv8n-cls      |
| Mock zone upgrade on confirm    | PATCH /api/zones/:id/risk-level            |
| Mock alert creation             | WebSocket or polling from FastAPI alerts   |
| Mock user in users.js           | JWT auth from FastAPI /auth                |
| Mock rainfall in weather.js     | IMD rainfall API or scraped data           |
