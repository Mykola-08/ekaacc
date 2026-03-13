'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ParallaxBackgroundProps {
  src: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
}

export default function ParallaxBackground({
  src,
  alt = 'Background image',
  children,
  className = '',
  overlayOpacity = 0.4,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <Image src={src} alt={alt} fill className="object-cover" priority={false} sizes="100vw" />
        <div
          className="absolute inset-0 bg-black transition-opacity duration-500"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
