import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);
    
    const updateInteractables = () => {
      const interactables = document.querySelectorAll("a, button, textarea, .glass-card, input");
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
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Precision Crosshair */}
      <div
        className={`cursor-crosshair-h ${isHovering ? 'hover' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
      />
      <div
        className={`cursor-crosshair-v ${isHovering ? 'hover' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
      />
      {/* Small Glowing Point */}
      <div
        className={`cursor-point ${isHovering ? 'hover' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
      />
    </>
  );
}
