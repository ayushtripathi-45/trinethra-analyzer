import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for trailing ring
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const updateInteractables = () => {
      const interactables = document.querySelectorAll("a, button, textarea, .glass-card, input, select");
      interactables.forEach(el => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };

    updateInteractables();
    const observer = new MutationObserver(updateInteractables);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="cursor-ring"
        style={{
          left: ringX,
          top: ringY,
        }}
        animate={{
          scale: isHovering ? 1.8 : isClicked ? 0.75 : 1,
          borderColor: isHovering ? "var(--primary)" : "var(--secondary-glow)",
          backgroundColor: isHovering ? "var(--primary-glow-thick)" : "rgba(0, 0, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />
      {/* Inner Precision Dot */}
      <motion.div
        className="cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          backgroundColor: isHovering ? "var(--primary)" : "var(--primary)",
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
