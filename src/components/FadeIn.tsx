import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: string;
  style?: React.CSSProperties;
}

/*
  motion.create() must NOT be called during render.

  It returns a brand new component type on every call, and React treats a
  changed element type as a different element: it unmounts the previous subtree
  and mounts a fresh one. Any parent re-render would therefore destroy these
  children and replay the entrance animation from opacity 0, which reads as the
  content blinking out. Caching by tag name keeps component identity stable, so
  parent re-renders (for example a hover state change) only update props.
*/
const motionComponentCache = new Map<string, React.ElementType>();

const getMotionComponent = (as: string): React.ElementType => {
  let cached = motionComponentCache.get(as);
  if (!cached) {
    cached = motion.create(as as keyof JSX.IntrinsicElements) as React.ElementType;
    motionComponentCache.set(as, cached);
  }
  return cached;
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = "",
  as = "div",
  style = {},
}) => {
  const Component = getMotionComponent(as);

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};
