require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  ? process.env.GEMINI_API_KEY.replace(/['"]/g, '').trim()
  : null;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an expert analyst for Trinethra, a B2B consulting company.
Analyze the supervisor transcript about a Fellow (early-career professional).

RUBRIC (1-10 scale):
1=Not Interested, 2=Lacks Discipline, 3=Motivated but Directionless
4=Careless, 5=Consistent Performer, 6=Reliable and Productive
7=Problem Identifier, 8=Problem Solver, 9=Innovative, 10=Exceptional

KEY DISTINCTION:
- Score 6: Does assigned tasks reliably. Initiative within given scope.
- Score 7: INDEPENDENTLY identifies problems supervisor hadn't noticed.

8 KPIs: Lead Generation, Lead Conversion, Upselling, Cross-selling,
NPS, PAT (Profitability), TAT (Turnaround Time), Quality

4 Assessment Dimensions:
1. Driving Execution
2. Systems Building
3. KPI Impact
4. Change Management

BEWARE of supervisor biases:
- Presence bias: always on floor does NOT mean high performer
- Helpfulness bias: handles all calls looks like 8 but is really 5-6
- Task absorption is NOT systems building
- Ignore tone, score ONLY behavioral evidence

Return ONLY valid JSON, no explanation, no markdown:
{
  "score": {
    "value": <1-10>,
    "label": "...",
    "justification": "...",
    "confidence": "low|medium|high"
  },
  "evidence": [
    {
      "quote": "...",
      "signal": "positive|negative|neutral",
      "dimension": "execution|systems|kpi|change",
      "interpretation": "..."
    }
  ],
  "kpiMapping": [
    {
      "kpi": "...",
      "evidence": "...",
      "systemOrPersonal": "system|personal"
    }
  ],
  "gaps": [
    {
      "dimension": "...",
      "detail": "..."
    }
  ],
  "followUpQuestions": [
    {
      "question": "...",
      "targetGap": "...",
      "lookingFor": "..."
    }
  ]
}`;

const extractJson = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('No JSON found');
  return JSON.parse(text.slice(start, end + 1));
};

async function analyze(transcript, suffix = '') {
  const payload = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\nTRANSCRIPT:\n${transcript}${suffix}`
      }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  };

  const t = Date.now();
  const response = await axios.post(GEMINI_URL, payload, { timeout: 30000 });
  console.log(`[Gemini API] Done in ${Date.now() - t}ms`);

  return response.data.candidates[0].content.parts[0].text;
}

app.post('/analyze', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    let rawText = await analyze(transcript);
    try {
      return res.json({ success: true, data: extractJson(rawText) });
    } catch (parseErr) {
      console.warn('[Gemini API] Initial JSON parse failed, retrying...', parseErr.message);
    }

    rawText = await analyze(transcript, '\n\nReturn ONLY raw JSON conforming to the requested schema. No markdown formatting.');
    return res.json({ success: true, data: extractJson(rawText) });
  } catch (err) {
    console.error('[Gemini API] Analysis failed:', err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'AI call failed', detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    status: 'Trinethra backend running!',
    mode: 'Gemini API (Cloud)'
  });
});

if (!GEMINI_API_KEY) {
  console.error('Gemini API key missing. Exiting.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
