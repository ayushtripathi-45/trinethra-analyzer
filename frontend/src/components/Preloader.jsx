import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "INITIALIZING NEURAL CORE...",
  "SYNCING PROTOCOLS...",
  "LOADING RUBRICS...",
  "CALIBRATING V4.0...",
  "DECRYPTING LOGIC...",
  "ESTABLISHING UPLINK...",
  "SYSTEMS READY."
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return 100;
        }
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });
    }, 200);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="preloader"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20000,
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.2,
        zIndex: -1
      }} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', width: '100%' }}
      >
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', letterSpacing: '0.3em', fontWeight: '900', marginBottom: '15px' }}>
          TRINETHRA
        </h1>
        
        <div style={{ height: '24px' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ 
                color: 'var(--primary)', 
                fontSize: '0.7rem', 
                letterSpacing: '0.2em',
                fontWeight: '600'
              }}
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="loader-bar-container" style={{ width: '280px', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '30px auto 15px' }}>
          <motion.div 
            className="loader-bar" 
            style={{ 
              width: `${progress}%`, 
              height: '100%',
              background: 'var(--primary)',
              boxShadow: '0 0 15px var(--primary)'
            }} 
          />
        </div>

        <p style={{ 
          fontFamily: 'monospace', 
          color: 'var(--text-dim)', 
          fontSize: '1rem',
          letterSpacing: '0.1em'
        }}>
          {Math.floor(progress)}%
        </p>
      </motion.div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%)',
        backgroundSize: '100% 2px',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
}
