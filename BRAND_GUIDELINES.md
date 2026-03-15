# JM Solutions — Brand & Design Guidelines
## GeoAlert Mine Safety Dashboard

---

## Brand Name Rules

Product: GeoAlert
Company: JM Solutions  (always TWO s — never "JM Solution")

Acceptable:
  JM Solutions
  JM SOLUTIONS (all caps, headings only)
  GeoAlert by JM Solutions
  GeoAlert Dashboard

Never use:
  JM Solution
  jm solutions
  JMsolutions
  jmSolutions

Show "GeoAlert by JM Solutions" in the sidebar header and browser tab title.

---

## Color Tokens

### Risk Colors (must be consistent across every screen)

| Level    | Token        | Hex       | When to use                          |
|----------|--------------|-----------|--------------------------------------|
| Safe     | riskGreen    | #2E7D32   | Safe zones, success states           |
| Caution  | riskYellow   | #F9A825   | Moderate risk, watch states          |
| High     | riskOrange   | #E65100   | High risk zones, strong warnings     |
| Critical | riskRed      | #B71C1C   | Critical zones only — use sparingly  |

RULE: Risk Red (#B71C1C) must ONLY be used for Critical alerts and zones.
Never use it for general UI decorations, headings, or empty states.

### Brand UI Colors

| Token           | Hex       | Use                                     |
|-----------------|-----------|-----------------------------------------|
| brandDark       | #0D1B2A   | Sidebar background, dark mode base      |
| brandMidnight   | #1A2B3C   | Cards in dark mode                      |
| brandSlate      | #263545   | Borders, dividers in dark mode          |
| brandWhite      | #F5F7FA   | Content area light mode background      |
| brandGray       | #E0E4EA   | Card backgrounds in light mode          |
| brandAccent     | #1565C0   | Primary buttons, active nav items       |
| brandAccentAlt  | #0288D1   | Secondary actions, info chips           |
| textPrimary     | #1A1A2E   | Main body text (light mode)             |
| textSecondary   | #546E7A   | Supporting text, meta info              |

---

## Typography

Font: Inter (load from Google Fonts in index.html)

| Use case          | Weight      | Size suggestion |
|-------------------|-------------|-----------------|
| Dashboard headings| SemiBold 600| 20–24px         |
| Section titles    | SemiBold 600| 16–18px         |
| Body text         | Regular 400 | 14px            |
| Labels and chips  | Medium 500  | 12–13px         |
| KPI values        | Bold 700    | 28–36px         |
| Meta / timestamps | Regular 400 | 12px            |

---

## Component Style Rules

Card border radius: 12px  
Button border radius: 8px  
Risk badge border radius: 6px (pill)  
Spacing base unit: 8px (MUI default)  
Shadows: subtle only — elevation 1 or 2 max, no dramatic drop shadows  
Icons: MUI Icons (@mui/icons-material) only  

Sidebar: brandDark background (#0D1B2A), white icons, brandAccent active state  
Content area (light mode): brandWhite (#F5F7FA)  
Content area (dark mode): brandMidnight (#1A2B3C)  

---

## Layout Rules

Desktop priority screens: Map, Dashboard, Analytics  
Mobile priority screens: Upload, Alerts, Crack Reports  

Sidebar behavior:
  Desktop: 240px expanded, collapses to 64px icon-only  
  Mobile: hidden, replaced by bottom navigation bar  

On mobile Upload page: stack form and preview vertically  
On mobile Alerts page: single column card list  

---

## Design Tone

This is an industrial safety tool, NOT a social or consumer app.

DO:
  - Clean, professional, serious visual language
  - Short action labels: "Acknowledge", "View Zone", "Confirm Critical"
  - Use icons to support text labels in the sidebar and action buttons
  - Use color purposefully — risk colors only for risk states

DON'T:
  - No emoji anywhere in the UI
  - No playful rounded buttons or bubbly UI elements
  - No decorative illustrations on functional screens
  - No overuse of red — it must feel like an alarm when it appears

---

## Logo Usage

Minimum digital size: 120px width  
Minimum print size: 25mm width  
Clear space: equal to the height of the "J" letterform  

Logo don'ts:
  Do not stretch or distort  
  Do not change brand colors  
  Do not rotate  
  Do not place on busy map backgrounds or risk color overlays  

---

## Risk Color Usage — Decision Guide

Ask before using a risk color:
  Is this representing an actual risk level? → Use risk color  
  Is this a general UI state like success, warning, info? → Use MUI default palette  
  Is this decorative? → Do not use a risk color  

RiskBadge component must always read from riskUtils.js.
Never hardcode hex values inside components.
