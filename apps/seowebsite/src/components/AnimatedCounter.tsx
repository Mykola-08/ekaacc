import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  triggerOnView?: boolean;
}

export default function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  triggerOnView = true,
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(start);

  const [elementRef, isInView] = useIntersectionObserver<HTMLSpanElement>({
    triggerOnce: true,
    threshold: 0.3,
  });

  const shouldAnimate = triggerOnView ? isInView : true;

  useEffect(() => {
    if (!shouldAnimate) return;

    const startTime = Date.now();
    const difference = end - start;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + difference * easeOut;

      setCurrent(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [shouldAnimate, start, end, duration]);

  const displayValue = current.toFixed(decimals);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Specialized counter for currencies
export function CurrencyCounter({
  amount,
  currency = '€',
  ...props
}: Omit<AnimatedCounterProps, 'end' | 'suffix'> & {
  amount: number;
  currency?: string;
}) {
  return (
    <AnimatedCounter
      {...props}
      end={amount}
      decimals={2}
      suffix={currency}
    />
  );
}

// Counter for percentages
export function PercentageCounter({
  percentage,
  ...props
}: Omit<AnimatedCounterProps, 'end' | 'suffix'> & {
  percentage: number;
}) {
  return (
    <AnimatedCounter
      {...props}
      end={percentage}
      decimals={1}
      suffix="%"
    />
  );
}
