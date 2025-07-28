"use client";

import { ReactNode, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  id?: string;
}

export default function ParallaxSection({ 
  children, 
  offset = 50, 
  className = '',
  id 
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section 
      ref={ref} 
      id={id}
      className={`relative overflow-hidden py-20 ${className}`}
    >
      <motion.div 
        style={{ y, opacity, scale }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
