"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function SamuraiCursor2() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Spring animations for smooth movement
  const x = useSpring(0, { damping: 25, stiffness: 300 });
  const y = useSpring(0, { damping: 25, stiffness: 300 });
  const scale = useSpring(1, { damping: 15, stiffness: 300 });
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      const { clientX, clientY } = e;
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], [data-cursor="special"]');
      
      // Update cursor position
      x.set(clientX - 15);
      y.set(clientY - 15);
      
      // Handle hover state
      if (interactive && !isHovering) {
        setIsHovering(true);
        scale.set(1.5);
      } else if (!interactive && isHovering) {
        setIsHovering(false);
        scale.set(1);
      }
      
      // Add sticky effect for buttons
      if (interactive && (interactive.tagName === 'BUTTON' || interactive.getAttribute('role') === 'button')) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - centerX, clientY - centerY);
        
        if (distance < 100) {
          x.set(centerX - 15 + (clientX - centerX) * 0.3);
          y.set(centerY - 15 + (clientY - centerY) * 0.3);
        }
      }
    };
    
    // Handle mouse down/up for click effect
    const handleMouseDown = () => {
      setIsClicking(true);
      scale.set(0.8);
    };
    
    const handleMouseUp = () => {
      setIsClicking(false);
      scale.set(isHovering ? 1.5 : 1);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isHovering, x, y, scale]);
  
  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-[99999] rounded-full border-2 border-primary-gold mix-blend-difference"
      style={{
        x,
        y,
        scale,
        width: '30px',
        height: '30px',
        backgroundColor: isHovering ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        borderColor: isHovering ? 'hsl(0, 100%, 27%)' : 'hsl(30, 100%, 52%)',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <motion.div 
        className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-primary-gold"
        animate={{
          scale: isClicking ? 2 : 1,
          opacity: isClicking ? 0.5 : 1,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 500 }}
      />
      
      <motion.div 
        className="absolute inset-0 m-auto w-full h-0.5 bg-primary-gold/50"
        animate={{
          scaleX: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.7 : 0.5,
        }}
      />
      <motion.div 
        className="absolute inset-0 m-auto w-0.5 h-full bg-primary-gold/50"
        animate={{
          scaleY: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.7 : 0.5,
        }}
      />
      
      {/* Click effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary-gold/20"
        animate={{
          scale: isClicking ? 1.5 : 0,
          opacity: isClicking ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
