'use client';

import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  amount?: number;
  duration?: number;
  once?: boolean;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
};

export const ScrollAnimation = ({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  amount = 0.3,
  duration = 0.5,
  once = true,
}: ScrollAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const controls = useAnimation();

  // Use the direction map for initial animation values
  const initial = directionMap[direction] || {};

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      });
    }
  }, [isInView, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ ...initial, opacity: 0 }}
      animate={controls}
      className={className}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

// Specialized animation components
export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  ...props 
}: Omit<ScrollAnimationProps, 'direction' | 'amount'>) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInFromLeft = ({ children, ...props }: Omit<ScrollAnimationProps, 'direction'>) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInFromRight = ({ children, ...props }: Omit<ScrollAnimationProps, 'direction'>) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
    {...props}
  >
    {children}
  </motion.div>
);

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}

export const StaggeredContainer = ({
  children,
  className = '',
  staggerChildren = 0.1,
  delayChildren = 0.2,
}: StaggeredContainerProps) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export const StaggeredItem = ({
  children,
  className = '',
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
}: StaggeredItemProps) => (
  <motion.div variants={variants} className={className}>
    {children}
  </motion.div>
);
