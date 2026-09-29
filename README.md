# JanPulse AI: Multilingual Citizen-Signal Intelligence Platform for India

> **Tagline:** *From Citizen Voice to Government Action*  
> **Track:** Hack2Skill *Build with AI: Code for Communities — Second Edition* (Track 1: AI for Digital Public Infrastructure & Governance)

---

## 1. Problem Statement

District administrations and urban local bodies across India receive citizen development requests and infrastructure grievances through fragmented channels (helpline numbers, ward visits, physical letters, and citizen portals). 

These requests suffer from three core bottlenecks:
1. **Linguistic Fragmentation:** Citizens submit grievances in multiple Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, etc.), which are difficult for single-language municipal departments to aggregate.
2. **Disconnected Symptoms:** Isolated complaints fail to reveal widespread underlying infrastructure breakdowns (e.g. 35 water complaints across a ward actually stemming from one burst feeder pipeline).
3. **Subjective Prioritization:** Governments struggle to identify geographic hotspots, urgency, affected populations, and high-priority interventions objectively.

---

## 2. Solution: JanPulse AI

**JanPulse AI** transforms fragmented multilingual citizen feedback into structured, evidence-grounded infrastructure intelligence.

* **Multilingual Citizen Signal Ingestion:** Accepts text and browser-based voice input in native Indian languages.
* **Gemini 3.8 Intelligence Layer:** Automatically identifies language, normalizes colloquial expressions into standardized English summaries, classifies infrastructure domains, and extracts impacted entities.
* **Geospatial Hotspot Clustering:** Automatically clusters related complaints by geographic proximity, time window, and failure domain.
* **Deterministic Priority Scoring:** Uses an auditable 5-factor mathematical formula (Volume 30%, Population 25%, Urgency 20%, Trend 15%, Service Gap 10%) so priority decisions remain transparent and non-hallucinated.
* **Evidence-Backed Government Action Briefs:** Uses Gemini to synthesize empirical citizen evidence into decision-ready action briefs for District Magistrates (DM) and municipal commissioners.

---

## 3. Key Features

- **Multilingual Support:** Tested with Hindi, Tamil, Telugu, Marathi, Bengali, and English.
- **Voice & Text Input:** Includes browser Web Speech recognition with graceful fallback.
- **Interactive India Map:** Lightweight vector geospatial visualization showing hotspot clusters, report concentration, and priority rings without requiring external paid Google Maps API keys.
- **Hotspot Intelligence Dossier:** Deep dive into each failure cluster showing original native language citizen quotes alongside AI normalized summaries.
- **Printable AI Action Briefs:** Decision-ready reports with executive summaries, problem analysis, evidence tables, and immediate next steps.
- **Deterministic Transparency:** Clear separation between AI semantic understanding and deterministic mathematical scoring.
- **3-Minute Judge Demo Mode:** 1-click live demonstration of signal ingestion, Gemini structuring, and hotspot clustering.

---

## 4. AI vs. Deterministic Architecture

| Component | Responsibility | Engine / Method |
| :--- | :--- | :--- |
| **Language Detection & Normalization** | Convert native vernacular to standardized English | Google Gemini 3.8 Flash |
| **Domain & Subcategory Classification** | Categorize into 10 public infrastructure domains | Google Gemini 3.8 Flash |
| **Entity Extraction** | Extract mentioned localities, vulnerable groups, requested action | Google Gemini 3.8 Flash |
| **Hotspot Clustering** | Spatial proximity and categorical grouping | Deterministic Haversine Math |
| **Priority Scoring** | Calculate 0-100 decision support score | Deterministic Multi-Factor Formula |
| **Action Brief Generation** | Synthesize empirical evidence into administrative dossier | Google Gemini 3.8 Flash (Grounded) |

---

## 5. Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (Strict Type Safety)
- **Styling:** Tailwind CSS (Civic-Tech Theme)
- **AI SDK:** `@google/genai` (Server-side only)
- **Icons:** `lucide-react`
- **Deployment Target:** Vercel (Serverless Compatible)

---

## 6. Gemini Integration & Security

All Gemini API calls are strictly executed **server-side** via Next.js route handlers (`/api/analyze-report` and `/api/generate-action-brief`). 

* The `GEMINI_API_KEY` is **never** exposed to the client or bundled into browser code.
* Centralized client module: `lib/ai/gemini.ts`.
* Configurable model via `GEMINI_MODEL` (defaults to `gemini-3.8-flash`).
* Deterministic query caching via `lib/ai/cache.ts` prevents redundant Gemini API calls.

---

## 7. Environment Variables

Create a `.env.local` file in your root directory:

```bash
# GEMINI_API_KEY: Required for server-side Gemini AI calls
GEMINI_API_KEY="your_gemini_api_key_here"

# GEMINI_MODEL: Configurable Gemini model (default: gemini-3.8-flash)
GEMINI_MODEL="gemini-3.8-flash"
```

---

## 8. Local Development

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY in .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 9. Vercel Deployment

JanPulse AI is designed to deploy directly to Vercel without microservices, Docker, or external databases:

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. In **Settings > Environment Variables**, add:
   * `GEMINI_API_KEY`: Your Google Gemini API key.
   * `GEMINI_MODEL`: `gemini-3.8-flash`.
4. Deploy.

---

## 10. Demo Walkthrough Flow (3 Minutes)

1. Open the landing page (`/`).
2. Click **"Run Live Demo (3 Min Flow)"** or select a sample complaint (e.g. Hindi water supply issue).
3. Inspect the live Gemini structured analysis card:
   - Detected Language: **Hindi**
   - Category: **Water Supply**
   - Normalized English text and urgency rationale.
   - Hotspot assignment to **Varanasi Drinking Water Failure**.
4. Open the **Intelligence Dashboard** (`/dashboard`):
   - View national KPIs and the interactive India Map.
   - Filter by State (e.g. Tamil Nadu, Bihar, Maharashtra).
5. Click **"Inspect Hotspot"** (`/hotspots/hs-up-varanasi-water`):
   - Review the deterministic priority score breakdown (Volume 30%, Pop 25%, Urgency 20%, Trend 15%, Gap 10%).
   - View original citizen reports in native script (Hindi, Tamil, Telugu) alongside standardized English translations.
6. Click **"Generate AI Action Brief"** (`/action-brief/hs-up-varanasi-water`):
   - Review the evidence-grounded administrative brief.
   - Click **"Print / Save PDF"** to test client-side report export.

---

## 11. Synthetic Data Disclaimer

All complaints, coordinates, and priority scores displayed in the demonstration interface are **Prototype Demonstration Data** generated synthetically for Track 1 of the Hack2Skill Build with AI hackathon. They do not represent official government records or actual citizen personal data.

---

## 12. Production Evolution Path

The modular repository structure (`lib/data`, `lib/ai`, `lib/scoring`, `lib/clustering`, `lib/types`) is built to scale in Phase 2:

- **Storage:** Replace `DemoDataProvider` with Google Cloud Firestore and BigQuery.
- **Identity:** Integrate Firebase Authentication with official DigiLocker / Aadhaar SSO.
- **Geocoding:** Integrate Google Maps Platform Geocoding & Places APIs.
- **Speech:** Integrate Bhashini or Google Cloud Speech-to-Text for multi-dialect regional voice intake.
