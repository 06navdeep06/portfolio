"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SamuraiCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    document.body.style.overflowX = 'hidden';

    // Track mouse position
    const mouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [data-cursor="special"]')) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    // Handle click state
    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    // Add event listeners
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    // Clean up
    return () => {
      document.body.style.cursor = '';
      document.body.style.overflowX = '';
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  // Cursor variants for different states
  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'hsl(30, 100%, 52%)',
      width: '32px',
      height: '32px',
    },
    hover: {
      x: position.x - 20,
      y: position.y - 20,
      scale: 1.2,
      backgroundColor: 'rgba(220, 38, 38, 0.2)',
      borderColor: 'hsl(0, 100%, 27%)',
      width: '40px',
      height: '40px',
    },
    click: {
      x: position.x - 14,
      y: position.y - 14,
      scale: 0.9,
      backgroundColor: 'rgba(220, 38, 38, 0.3)',
      borderColor: 'hsl(0, 100%, 27%)',
      width: '28px',
      height: '28px',
    },
  };

  // Determine which variant to use
  const currentVariant = isClicking ? 'click' : cursorVariant;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 rounded-full border-2 border-primary-gold mix-blend-difference"
        variants={cursorVariants}
        animate={currentVariant}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        {/* Inner dot */}
        <motion.div 
          className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-primary-gold"
          animate={{
            scale: isClicking ? 0.8 : 1,
            opacity: isClicking ? 0.7 : 1,
          }}
        />
      </motion.div>

      {/* Trailing effect */}
      <AnimatePresence>
        <motion.div
          className="fixed pointer-events-none z-40 rounded-full bg-primary-gold/20"
          initial={{ opacity: 0 }}
          animate={{
            x: position.x - 8,
            y: position.y - 8,
            opacity: 0.5,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 2 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 200,
            mass: 0.5,
          }}
          style={{
            width: '16px',
            height: '16px',
          }}
        />
      </AnimatePresence>
    </>
  );
};

export default SamuraiCursor;
