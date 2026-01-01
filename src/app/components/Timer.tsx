import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          }
          return duration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

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
        <svg className="w-[60vmin] h-[60vmin] landscape:w-[45vmin] landscape:h-[45vmin] md:w-72 md:h-72 -rotate-90" viewBox="0 0 288 288">
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
        <button
          onClick={onToggle}
          className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-700 flex items-center justify-center ${isAlarmActive
              ? 'bg-white animate-pulse text-black'
              : isRunning
                ? isBreak
                  ? 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white'
                  : 'bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] hover:from-[#93C5FD] hover:to-[#60A5FA] text-white'
                : 'bg-gradient-to-br from-[#D2691E] to-[#A0522D] hover:from-[#CD5C5C] hover:to-[#8B4513] text-white'
            }`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={handleReset}
          className={`w-16 h-16 rounded-full shadow-md hover:shadow-lg transition-all duration-700 flex items-center justify-center ${isRunning
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-[#F5E6D3] hover:bg-[#E8D4BD] text-[#5D4037]'
            }`}
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}