# JanPulse AI: Multilingual Citizen-Signal Intelligence Platform for India

> **Tagline:** *From Citizen Voice to Government Action*  
> **Hackathon Track:** Hack2Skill *Build with AI: Code for Communities — Second Edition* (Track 1: AI for Digital Public Infrastructure & Governance)

---

## 1. Problem Statement

District administrations and urban local bodies across India receive citizen development requests and infrastructure grievances through fragmented channels (helpline numbers, ward visits, physical letters, and citizen portals). 

These requests suffer from three core structural bottlenecks:
1. **Linguistic Fragmentation:** Citizens submit grievances in multiple Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, English, etc.), which are difficult for single-language municipal departments to aggregate and triage.
2. **Disconnected Symptoms:** Isolated complaints fail to reveal widespread underlying infrastructure breakdowns (e.g. 35 water complaints across a municipal ward actually stemming from one burst feeder pipeline).
3. **Subjective Prioritization:** Governments struggle to identify geographic hotspots, urgency, affected populations, and high-priority interventions objectively, frequently reacting to political volume rather than empirical need.

---

## 2. Solution: JanPulse AI

**JanPulse AI** operates as a Digital Public Good and an **AI-powered citizen-signal intelligence layer** between citizens and urban local bodies.

* **Multilingual Citizen Signal Ingestion:** Accepts text and browser-based voice input in native Indian languages.
* **Gemini 3.8 Intelligence Layer:** Automatically identifies language, normalizes colloquial expressions into standardized English summaries, classifies infrastructure domains, and extracts impacted entities.
* **Geospatial Hotspot Clustering:** Automatically clusters related complaints by geographic proximity, time window, and failure domain.
* **Deterministic Priority Scoring:** Uses an auditable 5-factor mathematical formula (Volume 30%, Population 25%, Urgency 20%, Trend 15%, Service Gap 10%) so priority decisions remain transparent and non-hallucinated.
* **Evidence-Backed Government Action Briefs:** Uses Gemini to synthesize empirical citizen evidence into decision-ready action briefs for District Magistrates (DM) and municipal commissioners.

---

## 3. Why JanPulse AI? (Competitive Differentiation)

Unlike generic citizen chatbots or basic complaint ticketing portals:
* **Intelligence Layer, Not a Chatbot:** JanPulse does not simply chat with citizens; it aggregates fragmented reports into macroscopic municipal intelligence.
* **Cross-Language Convergence:** A Hindi complaint in Varanasi, a Tamil complaint in Chennai, and an English grievance in Kolkata are analyzed with uniform semantic rigor.
* **Separation of Concerns:** Gemini performs linguistic comprehension and semantic normalization; deterministic code handles spatial distance and priority math.
* **Actionable Output:** Instead of raw tickets, administrators receive structured executive Action Briefs citing empirical citizen signals.

---

## 4. Track Alignment: AI for Digital Public Infrastructure & Governance

JanPulse AI directly satisfies the core challenge of **Track 1**:
1. **Digital Public Good Design:** Open standards, transparent scoring, zero proprietary vendor lock-in, and clear privacy boundaries.
2. **Citizen Ingestion at Scale:** Multilingual understanding covering 8+ Indian languages across 8 states.
3. **Actionable Governance:** Bridges the gap between citizen voices and PWD/municipal department engineering interventions.

---

## 5. AI & System Architecture

```text
[ Citizen Ingestion Layer ]
   Text (Vernacular) / Browser Voice Input
                     │
                     ▼
[ Gemini Understanding & Structuring Layer ]
   * Language Identification (Hindi, Tamil, Telugu, Marathi, Bengali, English)
   * Semantic Normalization to Standard English
   * 10-Domain Infrastructure Categorization
   * Entity & Vulnerable Group Extraction
   * Semantic Validation & Range Clamping (lib/ai/validation.ts)
                     │
                     ▼
[ Deterministic Intelligence Layer ]
   * Spatial Haversine Clustering (45km Radius)
   * In-Memory / Repository State Aggregation
   * Multi-Factor Deterministic Priority Scoring (0-100)
                     │
                     ▼
[ Governance & Decision-Support Layer ]
   * National Geospatial Hotspot Grid (EPSG:7755 Albers Conic Projection)
   * Hotspot Dossier & Signal Analysis
   * Grounded Gemini Administrative Action Briefs
```

---

## 6. Data Architecture

The prototype data model is defined in `lib/types/index.ts`:
* **`CitizenReport`**: Individual grievance record including raw vernacular text, language, coordinates, category, urgency, and normalized summary.
* **`InfrastructureHotspot`**: Clustered geospatial aggregation representing recurring failure points with report volume, trend velocity, and affected population estimates.
* **`PriorityBreakdown`**: Component scores detailing volume, population, urgency, trend, and infrastructure gap.
* **`ActionBrief`**: Administrative dossier containing problem analysis, evidence tables, intervention areas, and data limitations.

---

## 7. Gemini Integration & Prompt Defense

All Gemini API calls are strictly executed **server-side** via Next.js route handlers (`/api/analyze-report` and `/api/generate-action-brief`):

* **Model:** `@google/genai` TypeScript SDK using `gemini-3.8-flash` with automatic fallback to `gemini-flash-latest`.
* **Prompt Injection Defense:** Strict system instructions declare citizen inputs as untrusted data; overrides and role-play directives are neutralized.
* **Anti-Hallucination Guardrails:** Output schemas require explicit evidence citing; missing data fields are assigned `null` rather than fabricated.
* **Semantic Output Validation:** `lib/ai/validation.ts` enforces category whitelists, urgency enums, and bounds confidence between 0.0 and 1.0.

---

## 8. Multilingual Capability

Demonstrated with native script samples and audio inputs across:
* **Hindi** (e.g. Varanasi water contamination)
* **Tamil** (e.g. Chennai GST road cave-ins)
* **Telugu** (e.g. Warangal rural PHC medicine shortage)
* **Bengali** (e.g. Kolkata drainage overflow)
* **Marathi** (e.g. Pune waste disposal crisis)
* **English** (e.g. Bengaluru public transit route gaps)

The original language is preserved in the database and visible in the admin dossier alongside the English normalized interpretation.

---

## 9. Hotspot Detection Engine

Hotspot grouping is deterministic:
* **Category Match:** Reports must share the same primary infrastructure domain.
* **Spatial Proximity:** Uses Haversine distance formula to cluster reports within a 45km radius.
* **Dynamic Attachment:** New citizen submissions dynamically attach to existing clusters, incrementing volume, updating urgency distributions, and refreshing the priority score.

---

## 10. Deterministic Priority Methodology

Gemini **never** outputs the final priority score. The priority score (0–100) is calculated via:

$$\text{Priority Score} = 0.30 \times \text{Volume} + 0.25 \times \text{Population} + 0.20 \times \text{Urgency} + 0.15 \times \text{Trend} + 0.10 \times \text{Service Gap}$$

* **Volume (30%):** Normalized count (caps at 50 reports).
* **Population (25%):** Normalized affected citizens (caps at 20,000 citizens).
* **Urgency (20%):** Weighted distribution (Critical=100, High=75, Medium=45, Low=20).
* **Trend (15%):** Recent recurrence velocity percentage.
* **Service Gap (10%):** Essential baseline criticality (Water/Healthcare > Secondary).

---

## 11. Curated 3-Minute Judge Demo Flow

1. Open the home page (`/`).
2. Navigate to **"Curated Multilingual Test Scenarios"** (Judge Demo Panel).
3. Click **"Test This Scenario"** on any card:
   - **Hindi:** Varanasi Water Pipeline Failure
   - **Tamil:** Chennai Road Safety & Cave-ins
   - **Telugu:** Warangal Rural Healthcare PHC Shortage
   - **English:** Kolkata Monsoon Drainage Inundation
4. Inspect the real-time Gemini structured analysis:
   - Detected Language, Category, and English normalization.
   - Dynamic cluster linkage and updated priority score.
5. Explore the **Intelligence Dashboard** (`/dashboard`):
   - Albers Conic projection India map with 8 state hotspots.
6. Open any **Hotspot Dossier** (`/hotspots/hs-up-varanasi-water`):
   - Review transparent mathematical formula breakdown.
7. Click **"Generate Action Brief"** (`/action-brief/hs-up-varanasi-water`):
   - Inspect grounded administrative briefing with printable PDF styling.

---

## 12. Local Setup & Environment Variables

### Prerequisites
* Node.js 18+
* Google Gemini API Key

### Configuration
Create a `.env.local` file:
```bash
# Required Gemini API key (server-side only)
GEMINI_API_KEY="your_api_key_here"

# Optional Model Configuration
GEMINI_MODEL="gemini-3.8-flash"
GEMINI_FALLBACK_MODEL="gemini-flash-latest"
```

### Installation
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

---

## 13. Vercel Deployment

1. Push code to GitHub.
2. Import repository into Vercel.
3. In **Settings > Environment Variables**, add `GEMINI_API_KEY`.
4. Deploy.

---

## 14. Synthetic Data Disclaimer & Data Honesty

All complaint records, citizen names, and population figures in this prototype are **Synthetic Prototype Demonstration Data** created for evaluation in Track 1 of Hack2Skill. They do not represent official government records or actual citizen PII.

---

## 15. Known Prototype Limitations

* **In-Memory Volatility:** In the serverless demo environment, newly submitted complaints persist in memory during active server lifecycle but reset upon cold restarts.
* **Browser Speech Recognition:** Voice intake relies on the Web Speech API (Chrome/Edge/Safari); noisy outdoor environments require server-side ASR (Bhashini).
* **Spatial Proxies:** Coordinates are calibrated to district municipal centroids rather than high-precision GPS telemetry.

---

## 16. Future Google Cloud Architecture (Phase 2 Roadmap)

```text
[ Ingestion Gateway ] -> Cloud Pub/Sub
[ Processing ]        -> Cloud Run (Node.js/Next.js)
[ AI Models ]         -> Gemini 3.8 Flash via Vertex AI
[ Database ]          -> Google Cloud Firestore (State) & BigQuery (Telemetry)
[ Identity ]          -> Firebase Auth / DigiLocker Citizen SSO
[ Geospatial ]        -> Google Maps Platform Geocoding API
[ Voice ]             -> Bhashini / Cloud Speech-to-Text
```

---

## 17. Security & Privacy Considerations

* **Zero Client-Side Keys:** `GEMINI_API_KEY` is isolated to server-side API handlers.
* **No PII Persistence:** Citizen grievance inputs do not harvest phone numbers, Aadhaar numbers, or personal identifying tokens.
* **Strict Schema Sanitization:** All LLM outputs are validated against type-checked boundary schemas before serialization.
