import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onComplete?: () => void;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  isAlarmActive: boolean;
}

export function Timer({ duration, isRunning, onToggle, onReset, onComplete, mode, isAlarmActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const { theme } = useTheme();

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      endTimeRef.current = null;
      return;
    }

    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (endTimeRef.current) {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

        if (remaining <= 0) {
          clearInterval(interval);
          endTimeRef.current = null;
          if (onComplete) {
            onComplete();
          }
          setTimeLeft(duration * 60);
          return;
        }

        setTimeLeft(remaining);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, duration]);

  const handleReset = () => {
    setTimeLeft(duration * 60);
    onReset();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const isBreak = mode === 'shortBreak' || mode === 'longBreak';
  const getStrokeColor = () => {
    if (isBreak) return "#4ade80"; // Green for break
    return "#60A5FA"; // Blue for pomodoro
  };

  return (
    <div className="flex flex-col items-center gap-8 landscape:gap-3">
      {/* Circular Timer Display */}
      <div className={`relative rounded-full transition-shadow duration-700 ${isAlarmActive ? 'animate-alarm-pulse' :
        isRunning
          ? isBreak
            ? theme === 'dark' ? 'animate-timer-aura-green-dark' : 'animate-timer-aura-green-light'
            : theme === 'dark' ? 'animate-timer-aura-dark' : 'animate-timer-aura-light'
          : ''
        }`}>
        <svg className="w-[60vmin] h-[60vmin] landscape:w-[35vmin] landscape:h-[35vmin] md:w-72 md:h-72 -rotate-90" viewBox="0 0 288 288">
          <circle
            cx="144"
            cy="144"
            r="136"
            stroke={isRunning ? "rgba(255, 255, 255, 0.1)" : "rgba(139, 69, 19, 0.1)"}
            strokeWidth="8"
            fill="none"
            className="transition-all duration-700"
          />
          <circle
            cx="144"
            cy="144"
            r="136"
            stroke={isRunning || isAlarmActive ? getStrokeColor() : "#D2691E"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 136}`}
            strokeDashoffset={`${2 * Math.PI * 136 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-[12vmin] landscape:text-[10vmin] md:text-7xl font-light transition-colors duration-700 ${isRunning || isAlarmActive ? 'text-white' : 'text-[#5D4037]'
              }`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={onToggle}
            className={`w-16 h-16 landscape:w-14 landscape:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-700 flex items-center justify-center ${isBreak
              ? 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white'
              : 'bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] hover:from-[#93C5FD] hover:to-[#60A5FA] text-white'
              }`}
          >
            <Play className="w-6 h-6 landscape:w-5 landscape:h-5 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className={`w-16 h-16 landscape:w-14 landscape:h-14 rounded-full shadow-md hover:shadow-lg transition-all duration-700 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white`}
          >
            <RotateCcw className="w-6 h-6 landscape:w-5 landscape:h-5" />
          </button>
        )}
      </div>
    </div>
  );
}