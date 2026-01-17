import { useTheme } from 'next-themes';

interface TimeOptionsProps {
  selectedTime: number;
  onSelectTime: (minutes: number) => void;
  isRunning: boolean;
}

export function TimeOptions({ selectedTime, onSelectTime, isRunning }: TimeOptionsProps) {
  const { theme } = useTheme();
  const times = [25, 50, 90];

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onSelectTime(time)}
          className={`flex flex-col items-center justify-center w-16 h-16 md:w-auto md:h-auto md:px-8 md:py-3 rounded-full transition-all duration-700 ${selectedTime === time
            ? isRunning
              ? 'bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] text-white shadow-lg scale-105'
              : 'bg-gradient-to-br from-[#D2691E] to-[#A0522D] text-white shadow-lg scale-105'
            : isRunning
              ? (theme === 'dark'
                ? 'bg-white/10 text-gray-300 hover:bg-white/20 shadow-md hover:shadow-lg' // Dark mode running
                : 'bg-[#5D4037]/10 text-[#5D4037] hover:bg-[#5D4037]/20 shadow-md hover:shadow-lg') // Light mode running
              : 'bg-[#F5E6D3] text-[#5D4037] hover:bg-[#E8D4BD] shadow-md hover:shadow-lg'
            }`}
        >
          <span className="text-lg md:text-base font-bold md:font-normal">{time}</span>
          <span className="text-[10px] md:hidden">min</span>
          <span className="hidden md:inline ml-1">min</span>
        </button>
      ))}
    </div>
  );
}