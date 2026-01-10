import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
}

export function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse the target date and time
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  if (!timeLeft) {
    return null;
  }

  // Show different formats based on time left
  if (timeLeft.days > 0) {
    return (
      <div className="flex items-center gap-2 text-white/90">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          {timeLeft.days} day{timeLeft.days > 1 ? 's' : ''}, {timeLeft.hours}h away
        </span>
      </div>
    );
  }

  if (timeLeft.hours > 0) {
    return (
      <div className="flex items-center gap-2 text-white/90">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          {timeLeft.hours}h {timeLeft.minutes}m away
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
      <Clock className="w-5 h-5 text-white animate-pulse" />
      <div>
        <p className="text-white text-sm mb-0.5">Starting soon</p>
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className="text-white text-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-white/60 text-xs">min</div>
          </div>
          <div className="text-white/60">:</div>
          <div className="text-center">
            <div className="text-white text-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-white/60 text-xs">sec</div>
          </div>
        </div>
      </div>
    </div>
  );
}

