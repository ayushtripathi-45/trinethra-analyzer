import { useState } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ROADMAP = [
  {
    title: "User Accounts",
    desc: "Email + OAuth sign-up / login, saved transcript history and per-user dashboards."
  },
  {
    title: "Team Workspaces",
    desc: "Invite supervisors, share analyses, and aggregate cohort performance across a company."
  },
  {
    title: "Export & API",
    desc: "PDF / CSV exports and a public API key tier for embedding Trinethra in HR tooling."
  },
  {
    title: "Multimodal Intake",
    desc: "Upload meeting recordings and chat exports — not just pasted transcripts."
  }
];

export default function Upcoming() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth is planned for an upcoming release — wired to backend later.
    alert(`${mode === "login" ? "Login" : "Sign-up"} flow will be enabled in an upcoming version.`);
  };

  return (
    <div className="app-container">
      <motion.header className="header version-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <span className="version-badge">Trinethra v3.0 — Current</span>
        <h1 className="gradient-text font-main" style={{ fontSize: '3.5rem' }}>Cloud Intelligence</h1>
        <p className="font-secondary" style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '12px' }}>
          Powered by Gemini. Instant, scalable, bias-aware analysis — and the foundation for accounts &amp; teams.
        </p>
      </motion.header>

      <main className="version-section">
        <motion.section className="glass-card" style={{ padding: '50px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="neon-text font-secondary" style={{ marginBottom: '20px', fontSize: '1.8rem' }}>What v3.0 Delivers Today</h2>
          <ul className="timeline">
            <li>
              <h4>Gemini-powered analysis</h4>
              <p className="font-third">Local Ollama replaced with the Gemini API for fast, reliable scoring with no local setup.</p>
            </li>
            <li>
              <h4>Structured 4-block output</h4>
              <p>Score, evidence, KPI mapping and gap analysis returned as clean, validated JSON every time.</p>
            </li>
            <li>
              <h4>Zero-config backend</h4>
              <p>Single <code>GEMINI_API_KEY</code> env var — no model downloads, no warm-up, no cold starts.</p>
            </li>
          </ul>
        </motion.section>

        <motion.section className="glass-card" style={{ padding: '50px', marginTop: '30px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="neon-text font-secondary" style={{ marginBottom: '8px', fontSize: '1.8rem' }}>Accounts Are Coming</h2>
          <p className="font-third" style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>
            Login &amp; sign-up are part of the upcoming roadmap. The interface is ready — wiring to the backend
            arrives in the next release.
          </p>

          <div className="auth-wrap">
            <div className="auth-toggle">
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <input
                  className="auth-field"
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                />
              )}
              <input
                className="auth-field"
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="auth-field"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button className="auth-submit" type="submit">
                {mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </motion.section>

        <motion.section className="glass-card" style={{ padding: '50px', marginTop: '30px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="neon-text font-secondary" style={{ marginBottom: '12px', fontSize: '1.8rem' }}>Upcoming Roadmap</h2>
          <div className="roadmap-grid">
            {ROADMAP.map((r, i) => (
              <div key={i} className="glass-card roadmap-item">
                <h4>{r.title}</h4>
                <p className="font-third">{r.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
