import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FIXES = [
  {
    title: "Local-only analysis (Ollama gemma)",
    desc: "First working build that ran entirely on a local Ollama model. No cloud dependency, fully offline-capable."
  },
  {
    title: "Basic rubric scoring",
    desc: "Introduced the 1-10 DeepThought scale but with inconsistent confidence levels across similar transcripts."
  },
  {
    title: "Single JSON output",
    desc: "Returned score and a flat evidence list. KPI mapping and gap analysis were not yet separated."
  },
  {
    title: "Known gaps fixed later",
    desc: "Prompt leakage sometimes produced markdown around the JSON. Parsing failed on ~1 in 5 transcripts until v2 hardened extraction."
  }
];

export default function Version1() {
  return (
    <div className="app-container">
      <motion.header className="header version-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <span className="version-badge">Trinethra v1.0</span>
        <h1 className="gradient-text font-main" style={{ fontSize: '3.5rem' }}>The First Pulse</h1>
        <p className="font-secondary" style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '12px' }}>
          The original prototype — local inference, raw behavioral scoring, and the seed of the rubric.
        </p>
      </motion.header>

      <main className="version-section">
        <motion.section className="glass-card" style={{ padding: '50px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="neon-text font-secondary" style={{ marginBottom: '20px', fontSize: '1.8rem' }}>What v1.0 Shipped</h2>
          <p className="font-third" style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '30px' }}>
            Trinethra v1.0 was a proof-of-concept that proved supervisor feedback could be decoded into a structured
            behavioral score without human bias. It ran on a locally hosted model and focused purely on the core
            scoring loop.
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
          <h3 className="neon-text font-secondary" style={{ marginTop: '10px', fontSize: '1.4rem' }}>Retired</h3>
          <p className="font-third" style={{ color: 'var(--text-dim)', marginTop: '10px', lineHeight: '1.7' }}>
            v1.0 is no longer maintained. Its learnings directly shaped the cloud-powered architecture of v3.
          </p>
        </motion.section>
      </main>
    </div>
  );
}
