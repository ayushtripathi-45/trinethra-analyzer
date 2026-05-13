import { motion } from "framer-motion";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="app-container">
      <motion.header 
        className="header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="gradient-text" style={{ fontSize: '3.5rem' }}>The Intelligence Layer</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Deconstructing human perception through behavioral logic.</p>
      </motion.header>

      <main style={{ maxWidth: '900px', margin: '40px auto' }}>
        <motion.section 
          className="glass-card" 
          style={{ padding: '50px', marginBottom: '40px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="neon-text" style={{ marginBottom: '24px', fontSize: '2rem' }}>Trinethra Vision</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.15rem' }}>
            Trinethra is the "third eye" of B2B consulting. We transform informal, often biased supervisor feedback into high-fidelity behavioral data. By stripping away tone and focusing on concrete evidence, we provide an objective map of professional capability.
          </p>
        </motion.section>

        <motion.section 
          className="glass-card" 
          style={{ padding: '50px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="neon-text" style={{ marginBottom: '24px', fontSize: '2rem' }}>Strategic Rubric</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '30px' }}>
            The DeepThought scale is not a measure of "effort," but of **Independent Systems Impact**.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { level: "6", title: "Reliability", desc: "Consistently executes assigned workflows." },
              { level: "7", title: "Identification", desc: "Detects systemic anomalies independently." },
              { level: "8", title: "Resolution", desc: "Implements solutions without oversight." },
              { level: "9", title: "Innovation", desc: "Redesigns systems for exponential impact." }
            ].map((lvl, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '20px' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Score {lvl.level} • {lvl.title}</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginTop: '5px' }}>{lvl.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
