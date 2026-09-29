# JanPulse AI

> **From Citizen Voice to Government Action**  
> *An open-source, AI-powered citizen-signal intelligence layer for Digital Public Infrastructure (DPI) & municipal governance.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gen AI SDK](https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Project Owner](https://img.shields.io/badge/Project_Owner-AR_Singh-059669)](https://github.com/)

---

## 1. Executive Summary

Municipal administrations and urban local bodies across India receive tens of thousands of citizen development requests and infrastructure grievances monthly through fractured silos (portal tickets, handwritten petitions, phone helplines, social media complaints, and in-person ward visits).

These workflows suffer from three systemic failure modes:
1. **Linguistic Fragmentation:** Grievances arrive in diverse Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Gujarati, English, etc.), preventing single-language municipal departments from triaging converging signals.
2. **Symptom Isolation:** Complaints are managed as disconnected one-off tickets, masking widespread structural infrastructure failures (e.g. 40 localized water complaints stemming from a single damaged feeder main).
3. **Subjective Prioritization:** Triage is frequently driven by political escalation rather than objective, auditable metrics of population density, urgency, and essential service gaps.

**JanPulse AI** solves this structural bottleneck by acting as an **intelligent citizen-signal aggregation layer** between citizens and governance bodies. It ingests multilingual community voices, performs semantic structuring via Google Gemini, aggregates spatial failure clusters deterministically, calculates transparent priority metrics, and synthesizes evidence-grounded action briefs for district magistrates and municipal engineers.

---

## 2. Project Leadership

* **Project Owner & Lead Architect:** **AR Singh**
* **License:** [MIT License](LICENSE)
* **Architecture Philosophy:** Digital Public Good (DPG), open standards, auditable deterministic mathematics, strict privacy preservation, and zero proprietary lock-in.

---

## 3. Core Architectural Paradigm

JanPulse AI strictly separates **generative AI reasoning** from **deterministic decision logic**:

```
[ Citizen Ingestion Layer ]
  * Multilingual vernacular text & browser speech intake
  * Dialects: Hindi, Tamil, Telugu, Marathi, Bengali, English
                     │
                     ▼
[ Gemini 3.8 Intelligence Layer ]
  * Language Identification & Dialect Comprehension
  * Semantic Normalization to Standard Technical English
  * 10-Domain Infrastructure Categorization
  * Entity & Impacted Demographic Extraction
  * Semantic Range Validation (lib/ai/validation.ts)
                     │
                     ▼
[ Deterministic Intelligence Layer ]
  * Spatial Proximity Grouping (Haversine 45km radius)
  * Dynamic Cluster Attachment & State Aggregation
  * Auditable Multi-Factor Priority Equation (0–100)
                     │
                     ▼
[ Governance Decision-Support Layer ]
  * Calibrated Geospatial Map (Albers Conic Projection)
  * Hotspot Intelligence Dossiers with Original Vernacular Quotes
  * Evidence-Grounded Administrative Action Briefs (Print / PDF)
```

### Separation of Responsibilities

| Responsibility | Component | Engine / Method |
| :--- | :--- | :--- |
| **Vernacular Comprehension** | Language detection, colloquial translation | Google Gemini 3.8 Flash |
| **Domain Categorization** | Classification into 10 infrastructure sectors | Google Gemini 3.8 Flash |
| **Output Integrity** | Range clamping, whitelist validation, injection defense | `lib/ai/validation.ts` |
| **Spatial Clustering** | Geographic proximity & boundary aggregation | Deterministic Haversine Math |
| **Priority Scoring** | 0–100 auditable decision-support metric | Deterministic 5-Factor Formula |
| **Action Dossier Drafting** | Synthesis of empirical citizen evidence | Grounded Gemini 3.8 Flash |

---

## 4. Key Capabilities

### 4.1 Multilingual Convergence
Complaints logged in Hindi, Tamil, Telugu, Bengali, Marathi, or English regarding the same infrastructure corridor are recognized as a single converging breakdown. Original citizen voices are preserved in the dossier alongside standardized technical summaries.

### 4.2 Deterministic Priority Math (No AI Hallucinations)
Gemini **never** generates numerical priority scores. JanPulse uses an auditable, published equation:

$$\text{Priority Score} = 0.30 \times \text{Volume} + 0.25 \times \text{Population} + 0.20 \times \text{Urgency} + 0.15 \times \text{Trend} + 0.10 \times \text{Service Gap}$$

* **Volume (30%):** Normalized count (capped at 50 reports).
* **Population (25%):** Normalized affected demographic (capped at 20,000 citizens).
* **Urgency (20%):** Severity distribution (Critical: 100, High: 75, Medium: 45, Low: 20).
* **Trend (15%):** 7-day velocity acceleration percentage.
* **Service Gap (10%):** Essential service criticality baseline (Drinking Water / Healthcare > Secondary).

### 4.3 Evidence-Grounded Action Briefs
Produces executive dossiers tailored for District Magistrates (DM), Municipal Commissioners, and Public Works Departments (PWD). Recommendations strictly cite submitted citizen evidence without hallucinated budgets, unverified surveys, or fictitious government orders.

### 4.4 Curated Demonstration Suite
Includes a built-in evaluation panel with 4 multi-state scenarios:
* **Hindi:** Severe Drinking Water Pipeline Failure (Varanasi, Uttar Pradesh)
* **Tamil:** Arterial Road Potholes & Structural Cave-ins (Chennai, Tamil Nadu)
* **Telugu:** Primary Health Centre Doctor Absence & Drug Stockouts (Warangal, Telangana)
* **English:** Open Stormwater Drain Blockage & Monsoon Inundation (Kolkata, West Bengal)

---

## 5. Technology Stack

* **Frontend Framework:** Next.js 15+ (App Router, Server & Client Components)
* **Language:** TypeScript 5.9 (Strict Type Safety, Zero Implicit Any)
* **Styling:** Tailwind CSS v4, PostCSS, Lucide Icons
* **Generative AI SDK:** `@google/genai` (Official modern Google Gen AI TypeScript SDK)
* **Geospatial Engine:** Lightweight SVG vector renderer using EPSG:7755 (India National Albers Conic projection) — zero external paid mapping keys required
* **Runtime / Deployment:** Vercel serverless execution & Node.js 18+

---

## 6. Security & Integrity Engineering

* **Zero Client-Side Key Exposure:** `GEMINI_API_KEY` is strictly confined to server-side route handlers (`/api/*`). No `NEXT_PUBLIC_` prefixes or browser-side token leaks.
* **Prompt Injection Defense:** System instructions explicitly declare citizen input as untrusted raw data. Directives attempting role-play, administrative overrides, or system prompt leaks are neutralized.
* **Semantic Output Sanitization:** All model outputs pass through `validateAndSanitizeAIAnalysis` in `lib/ai/validation.ts`, validating category whitelists, urgency enums, and bounding confidence between 0.0 and 1.0.
* **Network & Proxy Resilience:** `safeFetchJson` validates response MIME types before parsing, gracefully handling HTML gateway timeouts (502/504) without syntax exceptions.
* **Rate-Limit Resilience:** Dual-tier execution (`gemini-3.8-flash` with fallback to `gemini-flash-latest`) and pre-seeded demonstration fixtures ensure zero downtime during high-concurrency reviews.

---

## 7. API Reference

### `POST /api/analyze-report`
Ingests unstructured citizen feedback and returns structured intelligence.

**Request Body:**
```json
{
  "text": "हमारे गांव और सिगरा वार्ड में पिछले तीन महीने से पानी की सप्लाई ठीक से नहीं आ रही है।",
  "state": "Uttar Pradesh",
  "district": "Varanasi",
  "locality": "Sigra",
  "categoryHint": "Water Supply",
  "isDemo": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "analysis": {
    "detectedLanguage": "Hindi",
    "normalizedText": "Continuous drinking water supply disruption for over three months...",
    "category": "Water Supply",
    "urgency": "Critical",
    "confidence": 0.95
  },
  "report": { "id": "rep-live-104921", "status": "Clustered" },
  "hotspot": { "id": "hs-up-varanasi-water", "priorityScore": 89 },
  "priority": { "overallScore": 89 },
  "source": "gemini"
}
```

### `POST /api/generate-action-brief`
Generates an administrative dossier for a specified hotspot cluster.

**Request Body:**
```json
{
  "hotspotId": "hs-up-varanasi-water"
}
```

### `GET /api/hotspots` & `GET /api/metrics`
Returns aggregated geospatial clusters, filtering parameters, and national infrastructure indicators.

---

## 8. Getting Started

### Prerequisites
* Node.js 18.17.0 or higher
* npm, yarn, or pnpm
* Google Gemini API Key ([Get a key here](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/janpulse-ai.git
   cd janpulse-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key"
   GEMINI_MODEL="gemini-3.8-flash"
   GEMINI_FALLBACK_MODEL="gemini-flash-latest"
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 9. Production Roadmap

```
[ Ingestion Gateway ] -> Cloud Pub/Sub / API Gateway
[ Core Application ]  -> Cloud Run (Next.js App Router)
[ AI Reasoning ]      -> Gemini 3.8 Flash via Vertex AI
[ Real-Time State ]   -> Google Cloud Firestore
[ Geospatial Telemetry] -> Google BigQuery & PostGIS
[ Official Identity ] -> DigiLocker / Aadhaar Citizen SSO
[ Field Telemetry ]   -> PWD / Municipal CRM Dispatch Connectors
```

---

## 10. Data Disclaimer

All complaints, citizen identities, and coordinates presented in this demonstration environment are **Synthetic Demonstration Records** generated for research and design validation of the JanPulse AI platform. They do not represent official government records or actual citizen PII.

---

## 11. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2026 AR Singh
```
