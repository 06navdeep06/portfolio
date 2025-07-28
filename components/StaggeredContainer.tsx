import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  duration?: number;
}

export function StaggeredContainer({
  children,
  className = '',
  delay = 0.2,
  staggerChildren = 0.1,
  duration = 0.5
}: StaggeredContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerChildren,
        duration: duration
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}
