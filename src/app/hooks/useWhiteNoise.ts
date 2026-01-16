import { useRef, useState, useEffect } from 'react';

interface BandConfig {
    freq: number;
    q: number;
    type: BiquadFilterType;
    minFreq: number;
    maxFreq: number;
}

const FREQUENCY_BANDS: Record<string, BandConfig> = {
    bass: {
        freq: 125,
        q: 0.7,
        type: 'lowshelf',
        minFreq: 32,
        maxFreq: 500
    },
    lowMids: {
        freq: 1000,
        q: 0.7,
        type: 'peaking',
        minFreq: 500,
        maxFreq: 2000
    },
    mids: {
        freq: 2500,
        q: 0.7,
        type: 'peaking',
        minFreq: 1000,
        maxFreq: 4000
    },
    highMids: {
        freq: 5000,
        q: 0.7,
        type: 'peaking',
        minFreq: 2000,
        maxFreq: 8000
    },
    treble: {
        freq: 10000,
        q: 0.7,
        type: 'highshelf',
        minFreq: 4000,
        maxFreq: 16000
    }
};

export const useWhiteNoise = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

    // Custom "Bass Heavy" preset values
    const volumes = {
        bass: 0.5, // Max
        lowMids: 0.0,
        mids: 0.0,
        highMids: 0.0,
        treble: 0.0
    };

    const createBandNoiseGenerator = (ctx: AudioContext, config: BandConfig, volume: number) => {
        // 30 seconds buffer
        const bufferSize = 30 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const bandGain = ctx.createGain();
        // Convert 0-0.5 volume scale to actual gain
        bandGain.gain.value = volume === 0 ? 0 : (volume / 0.5);

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = config.type;
        bandpass.frequency.value = config.freq;
        bandpass.Q.value = config.q;

        // Additional shaping
        const lowCut = ctx.createBiquadFilter();
        lowCut.type = 'highpass';
        lowCut.frequency.value = config.minFreq;

        const highCut = ctx.createBiquadFilter();
        highCut.type = 'lowpass';
        highCut.frequency.value = config.maxFreq;

        // Chain: Source -> LowCut -> BandPass -> HighCut -> Gain -> Master
        // But here we return the 'input' and the gain node

        const createSource = () => {
            const source = ctx.createBufferSource();
            source.buffer = noiseBuffer;
            source.loop = true;

            source.connect(lowCut);
            lowCut.connect(bandpass);
            bandpass.connect(highCut);
            highCut.connect(bandGain);

            return source;
        };

        return { gainNode: bandGain, createSource };
    };

    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();

            masterGainRef.current = audioContextRef.current.createGain();
            masterGainRef.current.gain.value = 0.5; // Master volume
            masterGainRef.current.connect(audioContextRef.current.destination);
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const toggleNoise = () => {
        if (isPlaying) {
            // Fade out
            if (masterGainRef.current && audioContextRef.current) {
                const currTime = audioContextRef.current.currentTime;
                masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, currTime);
                masterGainRef.current.gain.exponentialRampToValueAtTime(0.001, currTime + 0.5);

                setTimeout(() => {
                    activeSourcesRef.current.forEach(src => {
                        try { src.stop(); } catch (e) { }
                    });
                    activeSourcesRef.current = [];
                    setIsPlaying(false);
                    // Reset volume for next time
                    if (masterGainRef.current) masterGainRef.current.gain.value = 0.5;
                }, 500);
            }
        } else {
            initAudio();

            if (!audioContextRef.current || !masterGainRef.current) return;

            // Clear old sources
            activeSourcesRef.current.forEach(src => {
                try { src.stop(); } catch (e) { }
            });
            activeSourcesRef.current = [];

            // Create generators for each band
            Object.entries(FREQUENCY_BANDS).forEach(([name, config]) => {
                const vol = volumes[name as keyof typeof volumes];
                if (vol > 0) {
                    const { gainNode, createSource } = createBandNoiseGenerator(audioContextRef.current!, config, vol);
                    gainNode.connect(masterGainRef.current!);

                    const source = createSource();
                    source.start();
                    activeSourcesRef.current.push(source);
                }
            });

            // Fade in
            const currTime = audioContextRef.current.currentTime;
            masterGainRef.current.gain.setValueAtTime(0.001, currTime);
            masterGainRef.current.gain.exponentialRampToValueAtTime(0.5, currTime + 1);

            setIsPlaying(true);
        }
    };

    useEffect(() => {
        return () => {
            activeSourcesRef.current.forEach(src => {
                try { src.stop(); } catch (e) { }
            });
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { isPlaying, toggleNoise };
};
