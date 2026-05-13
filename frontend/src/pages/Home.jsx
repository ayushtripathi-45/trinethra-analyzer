import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const ROTATING_WORDS = ["PRECISION", "INSIGHTS", "STRATEGY", "ANALYTICS", "CLARITY"];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const textRevealVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.2, 1, 0.2, 1] } 
    }
  };

  const cardVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="bg-animate-wrapper">
      <div className="bg-animate"></div>
      <motion.div 
        className="app-container" 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '85vh', position: 'relative', zIndex: 1, paddingTop: '100px' }}
      >
        <motion.header className="header" style={{ marginBottom: '80px' }}>
          <div style={{ overflow: 'visible', marginBottom: '20px', height: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.h1 
                key={ROTATING_WORDS[index]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="gradient-text" 
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', letterSpacing: '-0.02em', position: 'absolute' }}
              >
                {ROTATING_WORDS[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
            <motion.h1 
              className="neon-text" 
              variants={textRevealVars}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '300', letterSpacing: '0.25em', textTransform: 'uppercase' }}
            >
              Deconstructed
            </motion.h1>
          </div>
          
          <motion.p 
            variants={textRevealVars}
            style={{ fontSize: '1rem', maxWidth: '500px', margin: '0 auto 40px', color: 'var(--text-dim)', lineHeight: '1.6' }}
          >
            Trinethra v4.0 leverages neural logic to decode supervisor feedback into actionable behavioral intelligence.
          </motion.p>

          <motion.div variants={cardVars}>
            <Link to="/explore">
              <button className="analyze-btn pulse-primary">
                ACCESS NEURAL CORE
              </button>
            </Link>
          </motion.div>
        </motion.header>
        
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', width: '100%', maxWidth: '1100px' }}
        >
          {[
            { title: "BEHAVIORAL AI", desc: "Pattern recognition for deep performance analytics." },
            { title: "STRATEGIC ALIGNMENT", desc: "Automated mapping to 8 critical KPI domains." },
            { title: "GAP SYNTHESIS", desc: "Instant detection of growth and risk vectors." }
          ].map((feat, i) => (
            <motion.div key={i} className="glass-card" style={{ padding: '40px', textAlign: 'left', borderLeft: '4px solid var(--primary)' }} variants={cardVars}>
              <h3 className="neon-text" style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-dim)', marginTop: '15px', lineHeight: '1.7', fontSize: '0.9rem' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
