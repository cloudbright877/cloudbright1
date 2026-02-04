'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

interface Shape {
  src: string;
  size: number;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  rotate: number;
}

interface FloatingShapesProps {
  shapes: Shape[];
}

export default function FloatingShapes({ shapes }: FloatingShapesProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Normalize mouse position to -1 to 1
      const xPct = (clientX / innerWidth - 0.5) * 2;
      const yPct = (clientY / innerHeight - 0.5) * 2;

      // Apply movement (20-30px range)
      mouseX.set(xPct * 25);
      mouseY.set(yPct * 25);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            ...shape.position,
            x,
            y,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          <div style={{ transform: `rotate(${shape.rotate}deg)` }}>
            <Image
              src={shape.src}
              alt="Decorative 3D shape"
              width={shape.size}
              height={shape.size}
              className="select-none"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
