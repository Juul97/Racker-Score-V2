import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ScoreCounterProps {
  value: number | string;
  className?: string;
}

export default function ScoreCounter({ value, className = '' }: ScoreCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(0, { stiffness: 100, damping: 15 });
  const opacity = useTransform(spring, [0, 1], [0.5, 1]);
  const scale = useTransform(spring, [0, 1], [0.8, 1]);

  useEffect(() => {
    setDisplayValue(value);
    spring.set(0);
    setTimeout(() => spring.set(1), 50);
  }, [value, spring]);

  return (
    <motion.div
      className={className}
      style={{ opacity, scale }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      {displayValue}
    </motion.div>
  );
}
