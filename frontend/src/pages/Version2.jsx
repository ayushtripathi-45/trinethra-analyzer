import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FIXES = [
  {
    title: "Hardened JSON extraction",
    desc: "Added a resilient extractor that strips markdown fences and recovers the first balanced JSON object, dropping parse failures to near zero."
  },
  {
    title: "Split evidence, KPI & gaps",
    desc: "The flat output was restructured into dedicated evidence, kpiMapping and gaps arrays for clearer downstream rendering."
  },
  {
    title: "Retry-with-instructions",
    desc: "If the first response failed validation, v2 re-called the model with stricter 'raw JSON only' instructions before giving up."
  },
  {
    title: "Bias guardrails tuned",
    desc: "Prompt strengthened against presence/helpfulness bias so 'always on floor' no longer inflated scores."
  },
  {
    title: "Residual limitation",
    desc: "Still bound to a local Ollama instance — setup was heavy and cold-start latency was unpredictable, motivating the move to Gemini in v3."
  }
];

export default function Version2() {
  return (
    <div className="app-container">
      <motion.header className="header version-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <span className="version-badge">Trinethra v2.0</span>
        <h1 className="gradient-text font-main" style={{ fontSize: '3.5rem' }}>The Stabilized Core</h1>
        <p className="font-secondary" style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '12px' }}>
          Reliability fixes, structured output, and stronger bias guardrails — the bridge to cloud intelligence.
        </p>
      </motion.header>

      <main className="version-section">
        <motion.section className="glass-card" style={{ padding: '50px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="neon-text font-secondary" style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Fixes &amp; Improvements in v2.0</h2>
          <p className="font-third" style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '30px' }}>
            v2.0 kept the local-model approach but focused entirely on correctness and output quality. Every fix below
            shipped in this release.
          </p>
          <ul className="timeline">
            {FIXES.map((f, i) => (
              <li key={i}>
                <h4>{f.title}</h4>
                <p className="font-third">{f.desc}</p>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section className="glass-card" style={{ padding: '50px', marginTop: '30px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <span className="meta-label">Status</span>
          <h3 className="neon-text font-secondary" style={{ marginTop: '10px', fontSize: '1.4rem' }}>Superseded by v3</h3>
          <p className="font-third" style={{ color: 'var(--text-dim)', marginTop: '10px', lineHeight: '1.7' }}>
            v2.0 solved parsing and structure, but the local dependency remained a bottleneck. v3 replaces the model
            layer with Gemini for instant, scalable analysis.
          </p>
        </motion.section>
      </main>
    </div>
  );
}
