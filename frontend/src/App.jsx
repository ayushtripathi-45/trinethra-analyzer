import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
// import Antigravity from "./components/Antigravity";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Explore from "./pages/Explore";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper title="CORE"><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper title="MISSION"><About /></PageWrapper>} />
        <Route path="/explore" element={<PageWrapper title="NEURAL"><Explore /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children, title }) {
  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
        className="shutter-overlay"
        style={{ pointerEvents: 'none' }}
      >
        <motion.h2 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.5] }}
          transition={{ duration: 1, times: [0, 0.5, 1] }}
          className="transition-text"
        >
          {title}
        </motion.h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="page-wrapper"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <div className="neural-bg-layer" />
      <div className="grid-overlay" />
      <div className="noise-overlay" />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
          >
            {/* Neural Background - Static Glows */}
            <div className="neural-bg-layer" />

            <CustomCursor />
            <Navbar />
            <AnimatedRoutes />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}