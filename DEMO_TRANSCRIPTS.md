# 🎙️ Demo Transcripts — Test Prompts for Trinethra

Paste any of the transcripts below into the **Explore** page (`/explore`) and click **ACCESS NEURAL CORE** to see Trinethra decode the supervisor feedback into a structured behavioral rubric.

Each sample is a realistic supervisor → Fellow (early-career professional) conversation. They are designed to exercise different score bands (2 → 9) so you can see how the engine handles bias, mixed signals, and standout performance.

---

## 1. Score ~5–6 · Consistent Performer (with bias traps)
> Use this to see how Trinethra resists "presence bias" and "helpfulness bias".

```
Supervisor: Ravi is always at his desk and handles all inbound calls. He did the lead tracking sheet only after I pushed him three times. He forwards broken onboarding emails to me instead of fixing them. He's reliable for the daily standups though, never misses one.
```

---

## 2. Score ~7 · Problem Identifier (independent)
> The Fellow spots issues the supervisor never noticed — a strong 7 signal.

```
Supervisor: Priya noticed our client follow-up template was missing a fallback for bounced emails, so she built a small retry flow without being asked. She also flagged that two regional teams were double-counting the same leads in the weekly report. Since she pointed it out, we cleaned up the attribution.
```

---

## 3. Score ~8 · Problem Solver
> Goes beyond identifying — implements the fix end to end.

```
Supervisor: Arjun reworked the entire onboarding checklist after noticing new hires took two weeks longer than needed. He documented it, trained the other interns, and cut ramp-up time by 40%. He now owns that process and mentors the next cohort without any oversight from me.
```

---

## 4. Score ~3–4 · Motivated but Directionless / Careless
> High effort, low independent impact — watch the engine separate "busy" from "effective".

```
Supervisor: Neha is super enthusiastic and stays late every day. But she keeps shipping the demo deck with outdated numbers because she doesn't double-check the source sheet. I've corrected the same formatting mistake four times. She means well but needs constant hand-holding on priorities.
```

---

## 5. Score ~9 · Innovative
> Redesigns systems for exponential impact.

```
Supervisor: Kabir built an internal tool that auto-summarizes every client call and drops the action items straight into our CRM. It saved the team roughly 10 hours a week. He then open-sourced the pattern to our other offices and presented it at the monthly all-hands. It's now a standard part of how we operate.
```

---

## 6. Score ~2 · Lacks Discipline
> Clear low-band signal.

```
Supervisor: Dev shows up late at least twice a week and misses most check-ins. The last three deliverables were submitted past deadline and had obvious errors. When I give feedback he agrees but nothing changes. I'm not sure he's a fit for the role.
```

---

## 7. Mixed / Edge Case · Biased but evidence-rich
> Good for testing the gap-analysis and follow-up questions output.

```
Supervisor: I love having Sam around, he's such a positive presence in the office and everyone likes him. He helped me prep for the client meeting last minute. That said, I can't really point to a system he improved — most of his work is ad-hoc and I keep re-explaining the same tasks. He's great though, real team player.
```

---

## 💡 Tips
- **Transcripts can be messy / conversational** — Trinethra ignores tone and scores only behavioral evidence.
- **Shorter is fine**, but ~3–6 sentences of concrete supervisor observations gives the best evidence mapping.
- **No transcript?** You'll get a `Transcript is required` validation error.
- The output returns: `score`, `evidence`, `kpiMapping`, `gaps`, and `followUpQuestions` as structured JSON.
