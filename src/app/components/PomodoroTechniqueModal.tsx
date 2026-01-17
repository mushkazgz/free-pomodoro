import { X, Clock, Brain, Coffee, Zap } from 'lucide-react';

interface PomodoroTechniqueModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
}

export function PomodoroTechniqueModal({ isOpen, onClose, isDark }: PomodoroTechniqueModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-2xl p-6 md:p-8 rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${isDark
                    ? 'bg-[#1a1a1a] text-gray-100 border border-white/10'
                    : 'bg-[#FFF8E7] text-[#5D4037] border border-[#DEB887]/20'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                        }`}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-4xl mb-2" style={{ fontFamily: '"Patrick Hand", cursive' }}>The Pomodoro Technique</h2>
                    <p className={`text-base opacity-70 ${isDark ? 'text-gray-400' : 'text-[#8D6E63]'}`}>
                        A time management method developed by Francesco Cirillo in the late 1980s.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* How it works */}
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            How it works
                        </h3>
                        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/40'} space-y-3`}>
                            <ol className="list-decimal list-inside space-y-2 opacity-90">
                                <li><strong className="text-blue-500">Pick a task.</strong> Choose something you want to get done.</li>
                                <li><strong className="text-blue-500">Set the timer.</strong> Traditionally 25 minutes (a "Pomodoro").</li>
                                <li><strong className="text-blue-500">Work until the ring.</strong> Focus exclusively on the task.</li>
                                <li><strong className="text-blue-500">Take a short break.</strong> 5 minutes to clear your mind.</li>
                                <li><strong className="text-blue-500">Repeat.</strong> Every 4 Pomodoros, take a longer break (15-30 min).</li>
                            </ol>
                        </div>
                    </section>

                    {/* Why it is useful */}
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-amber-500" />
                            Why is it so useful?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Combats Procrastination
                                </h4>
                                <p className="text-sm opacity-80">
                                    Knowing you only have to work for 25 minutes makes big tasks feel much less daunting.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Coffee className="w-4 h-4 text-amber-500" />
                                    Prevents Burnout
                                </h4>
                                <p className="text-sm opacity-80">
                                    Frequent breaks keep your mind fresh and focused, allowing you to sustain productivity for longer.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-amber-500" />
                                    ADHD Friendly
                                </h4>
                                <p className="text-sm opacity-80">
                                    For those with ADHD, the Pomodoro technique provides structured, bite-sized intervals that make task initiation easier and reduce overwhelm.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Brown Noise Focus
                                </h4>
                                <p className="text-sm opacity-80">
                                    This app includes a specialized "Brown Noise" generator. Its deep, lower-frequency sound profile is excellent for blocking distractions and calming the ADHD brain.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 ${isDark
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-[#D2691E] to-[#A0522D] text-white'
                            }`}
                    >
                        Start Focusing
                    </button>
                </div>

            </div>
        </div>
    );
}
