import { useState } from "react";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError("AI response parse nahi hua. Raw: " + data.raw);
    } catch (e) {
      setError("Backend se connect nahi ho pa raha. Kya server chal raha hai?");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: "#1a237e", color: "white", padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Trinethra</h1>
        <p style={{ margin: "4px 0 0", opacity: 0.8 }}>Supervisor Feedback Analyzer — DeepThought</p>
      </div>

      {/* Draft Warning */}
      <div style={{ background: "#FFF9C4", border: "1px solid #F9A825", padding: 10, borderRadius: 6, marginBottom: 16, fontWeight: "bold", color: "#E65100" }}>
        ⚠️ DRAFT — AI suggestions only. Review and edit before finalizing.
      </div>

      {/* Transcript Input */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 6 }}>
          Paste Supervisor Transcript:
        </label>
        <textarea
          rows={8}
          style={{ width: "100%", padding: 10, fontSize: 14, borderRadius: 6, border: "1px solid #ccc", resize: "vertical", boxSizing: "border-box" }}
          placeholder="Paste the supervisor's transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyze}
        disabled={loading}
        style={{ background: loading ? "#90CAF9" : "#1565C0", color: "white", padding: "12px 32px", fontSize: 16, border: "none", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer", marginBottom: 24 }}
      >
        {loading ? "Analyzing... (may take 15-30 sec)" : "Run Analysis"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", padding: 12, borderRadius: 6, color: "#B71C1C", marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>

          {/* Score */}
          <div style={{ background: "#E3F2FD", border: "2px solid #1565C0", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h2 style={{ margin: "0 0 8px", color: "#1565C0" }}>
              Suggested Score: {result.score?.value}/10 — {result.score?.label}
            </h2>
            <p style={{ margin: "0 0 4px" }}><b>Confidence:</b> {result.score?.confidence}</p>
            <p style={{ margin: 0 }}><b>Justification:</b> {result.score?.justification}</p>
          </div>

          {/* Evidence */}
          <div style={{ background: "#F3E5F5", border: "1px solid #9C27B0", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#6A1B9A" }}>Extracted Evidence</h3>
            {result.evidence?.map((e, i) => (
              <div key={i} style={{ background: "white", padding: 10, borderRadius: 6, marginBottom: 8, borderLeft: `4px solid ${e.signal === "positive" ? "#4CAF50" : e.signal === "negative" ? "#F44336" : "#9E9E9E"}` }}>
                <p style={{ margin: "0 0 4px", fontStyle: "italic" }}>"{e.quote}"</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                  <b>{e.signal?.toUpperCase()}</b> | {e.dimension} | {e.interpretation}
                </p>
              </div>
            ))}
          </div>

          {/* KPI Mapping */}
          <div style={{ background: "#E8F5E9", border: "1px solid #4CAF50", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#2E7D32" }}>KPI Mapping</h3>
            {result.kpiMapping?.map((k, i) => (
              <div key={i} style={{ background: "white", padding: 8, borderRadius: 6, marginBottom: 6 }}>
                <b>{k.kpi}</b> — {k.systemOrPersonal} | {k.evidence}
              </div>
            ))}
          </div>

          {/* Gaps */}
          <div style={{ background: "#FFF3E0", border: "1px solid #FF9800", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#E65100" }}>Gap Analysis</h3>
            {result.gaps?.length === 0 ? (
              <p>No gaps detected.</p>
            ) : (
              result.gaps?.map((g, i) => (
                <div key={i} style={{ background: "white", padding: 8, borderRadius: 6, marginBottom: 6 }}>
                  <b>{g.dimension}</b>: {g.detail}
                </div>
              ))
            )}
          </div>

          {/* Follow-up Questions */}
          <div style={{ background: "#FFEBEE", border: "1px solid #F44336", padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 10px", color: "#B71C1C" }}>Follow-up Questions</h3>
            {result.followUpQuestions?.map((q, i) => (
              <div key={i} style={{ background: "white", padding: 10, borderRadius: 6, marginBottom: 8 }}>
                <p style={{ margin: "0 0 4px" }}><b>Q{i + 1}:</b> {q.question}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>Target: {q.targetGap} | Looking for: {q.lookingFor}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}