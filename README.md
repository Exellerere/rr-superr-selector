# 🏏 RR SupeRR Selector — IPL 2027 Talent Scouting & Auction Engine
> **Official Season 2 Submission** | Built for Rajasthan Royals High Performance Analytics Lab

A modern, responsive, high-conviction cricket analytics web application engineered with **Next.js (App Router)**, **Tailwind CSS**, **Lucide React**, and **Recharts**. Designed to evaluate domestic uncapped talent across high-leverage match phases (Syed Mushtaq Ali Trophy, Vijay Hazare Trophy, Ranji Trophy, and state leagues) and optimize auction bidding strategies ahead of the **IPL 2027 Mega Auction**.

---

## 🎨 Design & Branding Palette
- **Deep Navy/Slate Background**: `#0F172A`
- **Royal Blue Cards & Glass Containers**: `#1E293B`
- **Rajasthan Royals Signature Pink**: `#EA1A85`
- **Championship Gold Accents**: `#F59E0B`
- **Electric Cyan/Blue Highlights**: `#38BDF8`

---

## 🚀 Key Features

### 1. Executive KPI Summary Cards
- **Total Domestic Players Analyzed**: 842 players tracked across SMAT, VHT, CK Nayudu, Ranji Trophy, and domestic leagues.
- **Top Uncapped Shortlist**: 10 premier targets covering 6 critical Rajasthan Royals squad holes.
- **Avg. Pressure Impact Score**: 89.6 / 100 (+26.4 points above domestic median).
- **Target Auction Purse Allocation**: Real-time tracking against RR's ₹34.50 Cr purse with dynamic reserve margin calculation.

### 2. Top 10 Young Uncapped Talent Table & Cards
- **Interactive Multi-Filter View**: Filter by tactical role, pressure score tiers (>90, >92), and full-text search across players, teams, and skills.
- **Toggle View Modes**: Instant switching between dense data table and visual scouting card grid.
- **Metric Sorting**: One-click sorting by Rank, Pressure Rating, Boundary %, Phase Metric, and Recommended Max Bid.
- **Slide-In Scouting Report Drawer**: Deep-dive dossier for each candidate featuring:
  - Lead Scout Analyst Summary
  - Technical Strengths & Identified Areas of Development
  - Rajasthan Royals Tactical Fit & Projected Role
  - Advanced Metric Percentiles vs. Domestic Uncapped Benchmark (Radar/Bars)
  - Signature High-Leverage Match Highlights

### 3. Interactive Scouting Visualizations (Recharts)
- **Scatter Matrix (Clutch Pressure vs. Performance)**:
  - Plots Strike Rate / Economy against Dynamic Pressure Rating.
  - Quadrant analysis highlights **undervalued domestic gems** in the top-right high-leverage sector.
  - Interactive toggles between Batters, Bowlers, and All Players.
  - Dynamic bubble sizing proportional to Recommended Max Bid.
- **Role-Wise Squad Gap Coverage (Bar Chart)**:
  - Evaluates Rajasthan Royals' current depth across 6 critical areas (Domestic Death Pacer, Power Finisher, Mystery Spinner, etc.) against the benchmark (90%) and maps shortlist availability.

### 4. Interactive Auction Purse & Squad Simulator
- **Live Purse & Roster Modeling**:
  - Base RR purse: **₹34.50 Cr** across **8 available slots** (with 3 overseas slots reserved).
  - Toggle candidates on/off with instantaneous recalculation of spent budget, remaining purse, remaining room per slot, and squad gap coverage percentage.
  - **Strategy Presets**:
    - *Pace & Power (Top 4)*
    - *Clutch Finishers First*
    - *All 10 Picks*
    - *Reset Selection*
  - **Export Sheet**: One-click copy of the complete bidding strategy and candidate allocations to clipboard.

### 5. Methodology & Model Architecture
- **Dynamic Pressure Index (DPI)**:
  $$DPI_i = \sum_{b=1}^{B_i} \left[ \omega_{phase} \cdot \text{LI}(b) \times (\Delta\text{WPA}(b) + \beta \cdot \text{BPA}(b)) \right] \times \Psi_{opp}$$
- **Purse Valuation & Max Bid Model**:
  $$\text{RMB}_i = \text{BasePrice}_i + \left( \frac{\text{DPI}_i - \mu}{\sigma} \right) \times \Phi_{scarcity}(\text{Role}_i) \times \text{BudgetFactor}_{RR}$$
- **Jaipur Sawai Mansingh Stadium Pitch Nuances**:
  - Spatial alignment with 71m square boundaries and second-innings dew adjustment.

---

## 🛠️ Decoupled Data Store: Swapping with Real CSV / JSON Datasets
All player profiles, metrics, and scouting reports are fully decoupled in:
```
src/data/players.ts
```
To load your custom model outputs:
1. Export your Python / R model predictions into JSON or CSV.
2. Ensure each record conforms to the exported `Player` TypeScript interface in `src/data/players.ts`.
3. Replace the `UNCAPPED_PLAYERS` array with your data.
4. Run `npm run build` — the entire dashboard, charts, tables, and simulator will update automatically with compile-time type safety!

---

## 💻 Local Development & Build Verification

```bash
# Navigate to project folder
cd C:\Users\GAURAV\.gemini\antigravity\scratch\rr-superr-selector

# Run development server
npm run dev

# Run ESLint verification (Zero errors, Zero warnings)
npm run lint

# Run optimized production build
npm run build

# Start production server locally
npm run start
```

---

## 🚢 Deploying to Vercel
This project is 100% Vercel-ready with zero external server dependencies:
1. Push your repository to GitHub / GitLab / Bitbucket.
2. In Vercel, select **Add New Project** and import the repository.
3. Framework Preset: **Next.js** (detected automatically).
4. Click **Deploy** — the static pages and client interactions compile cleanly with zero errors.
