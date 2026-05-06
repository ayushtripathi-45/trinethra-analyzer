<div align="center">

# Trinethra
### Supervisor Feedback Analyzer — DeepThought

*AI-assisted tool that turns unstructured supervisor transcripts into structured Fellow performance analyses — cutting intern review time from 45–60 min down to under 10.*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## What it does

A psychology intern pastes a supervisor call transcript → the app runs it through a local LLM → returns a structured analysis in under 60 seconds.

**Output per transcript:**

| Section | What you get |
|---|---|
| **Extracted Evidence** | Quotes colour-coded positive / negative / neutral |
| **Suggested Score (1–10)** | Rubric score with written justification + confidence level |
| **KPI Mapping** | Which of the 8 business KPIs the Fellow's work touches |
| **Gap Analysis** | Rubric dimensions the transcript did NOT cover |
| **Follow-up Questions** | Ready-to-use questions targeting each gap |

> AI suggests. Human decides. Every section is editable — there's no "Accept All" button by design.

---

## Screenshots

**Input — Paste transcript and run**

![Trinethra Input Screen](./screenshot-input.png)

**Output — Structured analysis panels**

![Trinethra Output Screen](./screenshot-output.png)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| LLM Runtime | Ollama (llama3.2, runs locally — no API key) |

---

## Architecture

```
Browser  →  React (port 5173)
                │  POST /api/analyze
                ▼
         Express (port 3001)
         - injects rubric into prompt
         - calls Ollama, parses JSON
                │  POST localhost:11434/api/generate
                ▼
         Ollama — llama3.2 (local)
```

---

## Setup

**Prerequisites:** Node.js v18+, Ollama installed

```bash
# 1. Pull the model (~2 GB)
ollama pull llama3.2

# 2. Clone & install
git clone https://github.com/ayushtripathi-45/trinethra-analyzer.git
cd trinethra-analyzer

# 3. Backend
cd backend && npm install && cp .env.example .env

# 4. Frontend
cd ../frontend && npm install
```

**Run (two terminals):**

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open **http://localhost:5173**

---

## Design Decisions Worth Noting

**Reliable JSON from the LLM** — Three-layer parsing: strict parse → strip markdown fences → accept partial result with UI warning. Reduced malformed responses from ~30% to under 5%.

**Preventing automation bias** — Score is labelled "Suggested." Intern must actively move the slider to finalize. Low-confidence scores show an amber warning badge. Evidence is always shown so the intern can verify the model's reasoning.

---

## What I'd Add Next

- Split-pane layout (transcript + analysis side by side)
- Session history sidebar for processing multiple Fellows
- Streaming response display (real-time output instead of spinner)
- Ollama `"format": "json"` mode to remove the parsing fallback entirely

---

## Contact

Built by **Ayush Tripathi** · [ayushtripathi9821@gmail.com](mailto:ayushtripathi9821@gmail.com) · [LinkedIn](https://linkedin.com/in/ayush-tripathi45)
