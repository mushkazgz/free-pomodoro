
import { useState, useCallback, useEffect } from 'react';

export const useSound = () => {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('pomodoroSoundMuted');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('pomodoroSoundMuted', JSON.stringify(isMuted));
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted((prev: boolean) => !prev);
    };

    const [alarmInterval, setAlarmInterval] = useState<NodeJS.Timeout | null>(null);

    const playSound = useCallback(() => {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const now = ctx.currentTime;

            // Bell parameters: Fundamental frequency + ratios for harmonics
            const fundamental = 440; // A4 (Lower, more grave)
            const harmonics = [1, 2, 3, 4.2, 5.4]; // Ratios
            const gains = [0.3, 0.15, 0.1, 0.05, 0.02]; // Mix levels

            harmonics.forEach((ratio, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(fundamental * ratio, now);

                // Envelope: Sharp attack, long exponential decay
                const duration = 2.5; // Seconds
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(gains[index], now + 0.02); // Attack
                gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay

                osc.start(now);
                osc.stop(now + duration);
            });

        } catch (error) {
            console.error("Audio playback error:", error);
        }
    }, [isMuted]);

    const startAlarm = useCallback(() => {
        // Play immediately
        playSound();
        if ("vibrate" in navigator) {
            navigator.vibrate([500, 200, 500]); // Vibrate pattern
        }

        // Loop every 3 seconds
        const interval = setInterval(() => {
            playSound();
            if ("vibrate" in navigator) {
                navigator.vibrate([500, 200, 500]);
            }
        }, 3000);

        setAlarmInterval(interval);
    }, [playSound]);

    const stopAlarm = useCallback(() => {
        if (alarmInterval) {
            clearInterval(alarmInterval);
            setAlarmInterval(null);
        }
        if ("vibrate" in navigator) {
            navigator.vibrate(0); // Stop vibration
        }
    }, [alarmInterval]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (alarmInterval) clearInterval(alarmInterval);
        };
    }, [alarmInterval]);

    return { isMuted, toggleMute, playSound, startAlarm, stopAlarm };
};
