interface TimeOptionsProps {
  selectedTime: number;
  onSelectTime: (minutes: number) => void;
  isRunning: boolean;
}

export function TimeOptions({ selectedTime, onSelectTime, isRunning }: TimeOptionsProps) {
  const times = [25, 45, 60];

  return (
    <div className="flex gap-3">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onSelectTime(time)}
          className={`px-8 py-3 rounded-full transition-all duration-700 ${
            selectedTime === time
              ? isRunning
                ? 'bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] text-white shadow-lg scale-105'
                : 'bg-gradient-to-br from-[#D2691E] to-[#A0522D] text-white shadow-lg scale-105'
              : isRunning
              ? 'bg-white/10 text-gray-300 hover:bg-white/20 shadow-md hover:shadow-lg'
              : 'bg-[#F5E6D3] text-[#5D4037] hover:bg-[#E8D4BD] shadow-md hover:shadow-lg'
          }`}
        >
          {time} min
        </button>
      ))}
    </div>
  );
}