import { X, Heart, BookOpen, Sliders } from 'lucide-react';
import { useState } from 'react';
import { PomodoroTechniqueModal } from './PomodoroTechniqueModal';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
}

export function AboutModal({ isOpen, onClose, isDark }: AboutModalProps) {
    const [isTechniqueOpen, setIsTechniqueOpen] = useState(false);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-lg p-8 rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[85vh] overflow-y-auto ${isDark
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
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-4xl mb-2" style={{ fontFamily: '"Patrick Hand", cursive' }}>freepomodoro</h2>
                    <p className={`text-sm opacity-70 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        Simple. Private. Free.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                            🔒 100% Private
                        </h3>
                        <p className="text-sm opacity-80">
                            No login required. No special permissions. All your data stays right here in your browser.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                            💸 Forever Free
                        </h3>
                        <p className="text-sm opacity-80">
                            This tool is completely free to use. No hidden fees, no subscriptions. Just pure focus.
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-green-500" />
                            Why Pomodoro?
                        </h3>
                        <p className="text-sm opacity-80 mb-3">
                            Learn more about the Pomodoro productivity technique.
                        </p>
                        <button
                            onClick={() => setIsTechniqueOpen(true)}
                            className={`text-sm font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            Read more about the technique &rarr;
                        </button>
                    </div>

                    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-purple-500" />
                            Related Free Apps
                        </h3>
                        <p className="text-sm opacity-80 mb-3">
                            Check out <strong>FreeNoiseGenerator</strong>: A total control noise frequency generator.
                        </p>
                        <a
                            href="https://freenoisegenerator.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            Visit freenoisegenerator.com &rarr;
                        </a>
                    </div>
                </div>

                <div className="text-center">
                    <p className="mb-4 text-sm opacity-80">
                        Enjoying the app? Consider buying me a coffee!
                    </p>
                    <a
                        href="https://www.paypal.com/donate/?business=VDWKX7KYKZB9Q&no_recurring=1&currency_code=EUR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-300 ${isDark
                            ? 'bg-[#60A5FA] hover:bg-[#3B82F6] text-white'
                            : 'bg-[#FFD700] hover:bg-[#FDB931] text-[#5D4037]'
                            }`}
                    >
                        <Heart className="w-5 h-5 fill-current" />
                        Donate with PayPal
                    </a>
                </div>

                <div className="mt-8 text-center text-xs opacity-50">
                    <p>Made with ❤️ for productivity lovers.</p>
                </div>

            </div>
            <PomodoroTechniqueModal
                isOpen={isTechniqueOpen}
                onClose={() => setIsTechniqueOpen(false)}
                isDark={isDark}
            />
        </div>
    );
}
