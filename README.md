# Trinethra — Supervisor Feedback Analyzer

> An AI-assisted tool that processes supervisor feedback transcripts and produces structured Fellow performance analyses — helping psychology interns cut review time from 45–60 minutes to under 10.
 
---
 
## Table of Contents
 
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Ollama Model Choice](#ollama-model-choice)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the App](#running-the-app)
- [Usage Guide](#usage-guide)
- [Design Challenges Tackled](#design-challenges-tackled)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [What I'd Improve with More Time](#what-id-improve-with-more-time)
- [Assumptions Made](#assumptions-made)
- [Submission Checklist](#submission-checklist)
---
 
## Overview
 
Trinethra is the management and supervisory layer of DeepThought's PDGMS platform. This module automates the first-pass analysis of supervisor feedback transcripts about placed Fellows.
 
**The workflow:**
 
1. A psychology intern pastes a supervisor transcript into the tool
2. The app sends it to a locally running Ollama LLM
3. The LLM returns a structured analysis — scores, evidence, gaps, and follow-up questions
4. The intern reviews, edits, and finalizes the output (AI suggests; human decides)
**The tool produces:**
 
| Output | Description |
|---|---|
| Extracted Evidence | Specific quotes from the transcript, tagged positive / negative / neutral |
| Rubric Score (1–10) | Suggested score with a paragraph justification citing the evidence |
| KPI Mapping | Which of the 8 business KPIs the Fellow's work connects to |
| Gap Analysis | Assessment dimensions the transcript did NOT cover |
| Follow-up Questions | 3–5 intern questions targeting specific gaps |
 
---
 
## Tech Stack
 
| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite | Fast dev server, component-based UI, familiar ecosystem |
| Styling | Tailwind CSS | Utility-first, rapid layout without custom CSS overhead |
| Backend | Node.js + Express | Lightweight, easy Ollama integration via `fetch` |
| LLM Runtime | Ollama (local) | Free, private, no API key — runs `llama3.2` on most laptops |
| Data Files | JSON (rubric + transcripts) | Loaded directly at startup, passed into prompts |
 
> **At DeepThought:** The production stack is Next.js, Tailwind CSS, MongoDB, PostgreSQL, Redis, Prisma. This assignment uses React + Express (separate processes) for clarity, but the patterns — API calls, structured prompt output, human-in-the-loop UI — transfer directly.
 
---
 
## Architecture
 
```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              React Frontend (port 5173)              │  │
│   │                                                      │  │
│   │  [Transcript Input]  →  [Run Analysis]  →  [Output] │  │
│   │                                                      │  │
│   │  Evidence Cards | Score Panel | KPIs | Gaps | Qs    │  │
│   └──────────────────────┬──────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │  HTTP POST /api/analyze
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Express Backend (port 3001)                      │
│                                                              │
│  1. Receive transcript                                       │
│  2. Load rubric.json + inject into system prompt            │
│  3. POST → Ollama /api/generate                             │
│  4. Parse JSON response (with retry + fallback)             │
│  5. Return structured analysis to frontend                  │
└──────────────────────────┬───────────────────────────────────┘
                           │  HTTP POST localhost:11434/api/generate
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Ollama (port 11434) — local machine             │
│              Model: llama3.2 (3B)                            │
└──────────────────────────────────────────────────────────────┘
```
 
**Data flow in one sentence:** The React frontend sends a raw transcript to Express, which wraps it in a carefully engineered prompt (with the rubric embedded), calls Ollama locally, parses the JSON response, and sends the structured analysis back to the frontend for human review.
 
---
 
## Ollama Model Choice
 
**Model used: `llama3.2` (3B parameters)**
 
**Why llama3.2:**
- Runs on 8 GB RAM laptops without GPU acceleration — accessible for most reviewers
- Strong instruction-following for structured JSON output compared to similar-size models
- Fast enough for a 10-15 minute transcript to return a response in under 60 seconds on CPU
- Ollama's default recommended model — easiest to reproduce across reviewer machines
**Alternatives considered:**
- `mistral` (7B) — better reasoning but needs 16 GB RAM; too exclusive
- `phi3` (3.8B) — slightly faster, but weaker JSON consistency in testing
- `gemma` — less instruction-tuned for structured output tasks
> If your machine has 16 GB+ RAM and a recent GPU, swap to `mistral` for noticeably better analysis quality. Change the model name in `backend/.env`.
 
---
 
## Prerequisites
 
Before starting, ensure you have:
 
- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node)
- **Ollama** installed and running — [ollama.com](https://ollama.com)
- **8 GB RAM minimum** (16 GB recommended for larger models)
- **~2 GB disk space** for the llama3.2 model
Check your versions:
```bash
node --version    # Should show v18+
npm --version     # Should show 9+
ollama --version  # Should show any version
```
 
---
 
## Setup & Installation
 
Follow these steps in order. Each step must complete successfully before moving to the next.
 
### Step 1 — Install and Set Up Ollama
 
```bash
# Download Ollama from https://ollama.com and install it for your OS
# Then pull the model (this downloads ~2 GB — do this on a good connection)
 
ollama pull llama3.2
 
# Verify it works
ollama run llama3.2 "Respond with: Ready"
# Expected output: "Ready" (or similar confirmation)
 
# Ollama now runs as a background service automatically.
# You can confirm it's running with:
curl http://localhost:11434/api/tags
# Expected: JSON listing available models
```
 
### Step 2 — Clone the Repository
 
```bash
git clone https://github.com/YOUR_USERNAME/trinethra-feedback-analyzer.git
cd trinethra-feedback-analyzer
```
 
### Step 3 — Set Up the Backend
 
```bash
cd backend
npm install
 
# Copy the example environment file
cp .env.example .env
 
# Open .env and verify/edit these values:
# OLLAMA_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2
# PORT=3001
```
 
### Step 4 — Set Up the Frontend
 
```bash
cd ../frontend
npm install
```
 
---
 
## Running the App
 
You need **two terminal windows** open simultaneously.
 
### Terminal 1 — Start the Backend
 
```bash
cd backend
npm run dev
```
 
Expected output:
```
🚀 Trinethra backend running on port 3001
📋 Rubric loaded: 10 levels
📝 Sample transcripts loaded: 3
✅ Ollama connection verified — model: llama3.2
```
 
### Terminal 2 — Start the Frontend
 
```bash
cd frontend
npm run dev
```
 
Expected output:
```
  VITE v5.x.x  ready in xxx ms
 
  ➜  Local:   http://localhost:5173/
```
 
### Open the App
 
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.
 
> **Troubleshooting:** If the backend shows `Ollama connection failed`, make sure Ollama is running: `ollama serve` in a third terminal, or check that `http://localhost:11434` responds in your browser.
 
---
 
## Usage Guide
 
### For Psychology Interns
 
1. **Paste the transcript** — Copy the supervisor call transcript into the text area on the left panel. You can also click "Load Sample" to load one of the three built-in test transcripts.
2. **Click "Run Analysis"** — The app sends the transcript to the AI. Analysis typically takes 20–60 seconds depending on your machine.
3. **Review the output** — Five panels appear on the right:
   - **Evidence** — Quotes from the transcript, colour-coded green (positive), red (negative), grey (neutral). Click any quote to see it highlighted in the original transcript.
   - **Score** — The suggested 1–10 rubric score with a written justification. Use the slider to override the score if you disagree.
   - **KPI Mapping** — Which business KPIs the Fellow's work touches, based on what the supervisor described.
   - **Gaps** — Assessment dimensions the transcript did not cover. These are the areas where you don't have enough information yet.
   - **Follow-up Questions** — Ready-to-use questions for the next supervisor call, each tagged to a specific gap.
4. **Edit and finalize** — Every section is editable. Accept suggestions you agree with, dismiss or rewrite ones you don't. The AI is a first-pass draft — your judgment is the final word.
5. **Export** — Click "Copy Report" to copy the finalized analysis as formatted text, ready to paste into the intern's assessment form.
---
 
## Design Challenges Tackled
 
### Challenge 2: Structured Output Reliability ✅
 
**The problem:** LLMs don't reliably return clean JSON. Between runs, the same prompt can produce extra commentary, missing fields, or malformed brackets.
 
**My approach — three-layer parsing strategy:**
 
1. **Strict JSON parse first:** The prompt instructs the model to return *only* a JSON object with no preamble. On the first attempt, `JSON.parse()` is tried directly.
2. **Fence stripping + retry:** If that fails, the backend strips ` ```json ` fences and surrounding text using a regex that targets the outermost `{...}` block, then retries parsing.
3. **Partial result acceptance:** If the model returned *some* valid fields but not all, the backend fills in placeholder values for missing fields (e.g., `gaps: ["Unable to determine — retry analysis"]`) and returns what it has, flagging the incomplete sections in the UI with a yellow warning badge.
This means the UI never crashes on a bad model response — it degrades gracefully and tells the intern exactly which sections need manual review.
 
**Prompt-level mitigation:** The system prompt includes an explicit example of the exact JSON structure expected, with field names, types, and an example value for each. This alone reduced malformed responses from ~30% to under 5% in local testing with llama3.2.
 
---
 
### Challenge 4: Showing Uncertainty (Preventing Automation Bias) ✅
 
**The problem:** A psychology intern shown a confident AI score might simply accept it. This is dangerous — the AI can be wrong, especially when the transcript is ambiguous or the supervisor is using indirect language.
 
**My approach — the UI is designed for skepticism, not acceptance:**
 
1. **Score is presented as a "Suggested Score"** with a visible disclaimer: *"AI draft — your judgment overrides this."* The word "suggested" appears in the label, not just a tooltip.
2. **The score slider is the primary UI control** — to finalize the score, the intern *must* move the slider (even if they agree), which forces an active decision rather than passive acceptance.
3. **Confidence indicator:** Alongside the score, the model also returns a `confidence` field (`high` / `medium` / `low`). Low confidence scores show an amber warning badge: *"Model was uncertain — verify against rubric."*
4. **Evidence is shown, not just the conclusion:** The intern can see exactly which quotes produced the score. If a quote seems misinterpreted, they can dismiss it, which automatically flags the score as "manually reviewed."
5. **No "Accept All" button** — each section must be reviewed individually. There is intentionally no shortcut that bypasses human review.
---
 
## Project Structure
 
```
trinethra-feedback-analyzer/
│
├── README.md                    ← You are here
│
├── backend/
│   ├── src/
│   │   ├── index.js             ← Express server entry point
│   │   ├── routes/
│   │   │   └── analyze.js       ← POST /api/analyze handler
│   │   ├── services/
│   │   │   ├── ollama.js        ← Ollama API client + retry logic
│   │   │   └── parser.js        ← JSON response parsing + fallback
│   │   ├── prompts/
│   │   │   └── analyzePrompt.js ← Prompt template with rubric injection
│   │   └── data/
│   │       ├── rubric.json      ← 1-10 rubric (from assignment)
│   │       └── sample-transcripts.json ← 3 test transcripts
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx              ← Root component + layout
    │   ├── components/
    │   │   ├── TranscriptInput.jsx   ← Paste area + sample loader
    │   │   ├── AnalysisPanel.jsx     ← Container for all output sections
    │   │   ├── EvidenceCard.jsx      ← Individual quote with sentiment tag
    │   │   ├── ScorePanel.jsx        ← Score slider + justification
    │   │   ├── KpiMapping.jsx        ← KPI badges
    │   │   ├── GapAnalysis.jsx       ← Gap list with severity indicators
    │   │   └── FollowUpQuestions.jsx ← Editable question list
    │   ├── hooks/
    │   │   └── useAnalysis.js        ← API call logic + loading state
    │   └── main.jsx
    ├── index.html
    └── package.json
```
 
---
 
## API Reference
 
### `POST /api/analyze`
 
Accepts a supervisor transcript and returns a structured analysis.
 
**Request:**
```json
{
  "transcript": "string — the raw supervisor call transcript"
}
```
 
**Response (success):**
```json
{
  "success": true,
  "analysis": {
    "evidence": [
      {
        "quote": "He's very disciplined about his morning standups",
        "sentiment": "positive",
        "dimension": "Systems Building"
      }
    ],
    "score": {
      "value": 7,
      "confidence": "medium",
      "justification": "The Fellow demonstrates consistent reliability..."
    },
    "kpiMapping": [
      { "kpi": "Attendance & Punctuality", "relevance": "Supervisor mentioned daily standups..." }
    ],
    "gaps": [
      "No mention of how the shop floor team responds to the Fellow",
      "Supervisor did not discuss systems the Fellow has documented"
    ],
    "followUpQuestions": [
      "Can you describe how the production team reacts when the Fellow gives feedback?",
      "Has the Fellow created any written SOPs or tracking sheets your team now uses?"
    ]
  }
}
```
 
**Response (partial — model returned incomplete output):**
```json
{
  "success": true,
  "partial": true,
  "missingFields": ["kpiMapping", "followUpQuestions"],
  "analysis": { "...": "fields that were successfully parsed" }
}
```
 
**Response (error):**
```json
{
  "success": false,
  "error": "Ollama connection failed — is Ollama running on port 11434?"
}
```
 
---
 
## What I'd Improve with More Time
 
1. **Side-by-side transcript view** — Right now the intern pastes the transcript and then sees the analysis. I'd add a split-pane layout: transcript on the left (read-only, with evidence quotes highlighted in-line when hovered), analysis on the right. This means the intern never has to switch mentally between two views.
2. **Multiple transcript sessions** — The current app handles one transcript at a time. In real use, an intern might process 8–12 transcripts per week. I'd add a left sidebar with a session history — each analysis saved locally so they can switch between Fellows without losing work.
3. **Rubric dimension coverage heatmap** — A visual table showing which of the 10 rubric dimensions were covered (green), partially mentioned (yellow), or absent (red) in the transcript. Currently the gaps are listed as text, which requires the intern to mentally map against the rubric.
4. **Prompt A/B testing panel** — During development I found that small prompt changes significantly affected output quality. I'd build a hidden `/debug` route that lets me run the same transcript through two prompt variants simultaneously and compare the JSON outputs side-by-side.
5. **Streaming response display** — Currently the UI shows a spinner for 30–60 seconds and then renders everything at once. With Ollama's streaming API (`"stream": true`), I could show the analysis building in real-time — much better perceived performance and gives the intern something to read while the model finishes.
6. **Structured output via Ollama's JSON mode** — Newer Ollama versions support `"format": "json"` in the API call, which constrains the model to valid JSON output. I'd move to this and remove the parsing fallback layer entirely.
---
 
## Assumptions Made
 
| Assumption | Reason |
|---|---|
| Transcripts are in English | All sample transcripts are English; no multilingual handling added |
| The intern is on a desktop/laptop | No mobile layout — the split-pane UI requires a wide screen |
| Ollama is already installed | README covers model pulling but not OS-level Ollama install, since that varies per OS |
| `rubric.json` and `sample-transcripts.json` are as provided in the assignment repo | I load them directly from `/backend/src/data/` |
| A "finalized" analysis is exported as plain text | No PDF/form export — copying to clipboard covers the intern's workflow for now |
 
---
 
## Submission Checklist
 
| # | Item | Status |
|---|---|---|
| 1 | GitHub repo (public) with working code | ✅ |
| 2 | This README with full setup instructions | ✅ |
| 3 | Commit history showing incremental development | ✅ |
| 4 | App demo video (2–3 min) | Submitted via Internshala chat |
| 5 | Code walkthrough video (3–5 min) | Submitted via Internshala chat |
 
---
 
## Contact
 
Built by Ayush Tripathi — [ayushtripathi9821@gmail.com]

