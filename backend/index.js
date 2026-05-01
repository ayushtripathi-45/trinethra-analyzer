const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an expert analyst for DeepThought, a B2B consulting company.
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

app.post('/analyze', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  const prompt = `${SYSTEM_PROMPT}\n\nTRANSCRIPT:\n${transcript}`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2',
      prompt: prompt,
      stream: false
    });

    const rawText = response.data.response;

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, data: parsed });
    } catch (parseErr) {
      // Retry once
      const retry = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: prompt + '\n\nIMPORTANT: Return ONLY raw JSON. No text before or after.',
        stream: false
      });

      try {
        const parsed2 = JSON.parse(retry.data.response);
        return res.json({ success: true, data: parsed2 });
      } catch {
        // Both failed — return raw text
        return res.json({ success: false, raw: rawText });
      }
    }

  } catch (err) {
    return res.status(500).json({ error: 'Ollama call failed', detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Trinethra backend running!' });
});

app.listen(8000, () => {
  console.log('Backend running at http://localhost:8000');
});