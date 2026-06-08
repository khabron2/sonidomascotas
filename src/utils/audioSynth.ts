import { AnimalId } from "../types";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Low-pass/Band-pass Noise generator for textured sounds (bark breath, bubbler, chomper)
function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

const REAL_ANIMAL_SOUNDS: Record<AnimalId, string> = {
  [AnimalId.PERRO]: "/audio/dog.mp3",
  [AnimalId.GATO]: "/audio/cat.mp3",
  [AnimalId.CANARIO]: "/audio/canary.mp3",
  [AnimalId.CONEJO]: "/audio/rabbit.mp3",
  [AnimalId.TORTUGA]: "/audio/turtle.mp3",
  [AnimalId.PEZ]: "", // Fish keeps realistic water bubbling synth
};

/**
 * Play a stylized, interactive synthesized animal sound (Synthesized Fallback)
 */
function playBackWithSynth(id: AnimalId, onEnd?: () => void) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (id) {
      case AnimalId.PERRO: {
        // Synthesizing a realistic "¡Guau, guau!" (Two rapid barks)
        const playBark = (startTime: number) => {
          const noise = ctx.createBufferSource();
          noise.buffer = createNoiseBuffer(ctx, 0.25);
          
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = "bandpass";
          noiseFilter.frequency.setValueAtTime(300, startTime);
          noiseFilter.frequency.exponentialRampToValueAtTime(100, startTime + 0.15);
          noiseFilter.Q.value = 4;

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.4, startTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);

          const osc = ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(160, startTime);
          osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.18);

          const oscGain = ctx.createGain();
          oscGain.gain.setValueAtTime(0.8, startTime);
          oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);

          noise.start(startTime);
          noise.stop(startTime + 0.25);
          osc.start(startTime);
          osc.stop(startTime + 0.25);
        };

        playBark(now);
        playBark(now + 0.35);

        setTimeout(() => onEnd?.(), 700);
        break;
      }

      case AnimalId.GATO: {
        // Synthesizing "¡Miau!"
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc2.type = "triangle";

        osc1.frequency.setValueAtTime(450, now);
        osc1.frequency.linearRampToValueAtTime(750, now + 0.15);
        osc1.frequency.exponentialRampToValueAtTime(350, now + 0.55);

        osc2.frequency.setValueAtTime(455, now);
        osc2.frequency.linearRampToValueAtTime(755, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(353, now + 0.55);

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
        filter.frequency.exponentialRampToValueAtTime(600, now + 0.55);
        filter.Q.value = 3.5;

        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.01, now);
        mainGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
        mainGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.7);
        osc2.stop(now + 0.7);

        setTimeout(() => onEnd?.(), 700);
        break;
      }

      case AnimalId.CANARIO: {
        // Synthesizing "¡Pío, pío, pío!" (Cheerful singing bird)
        const playChirp = (startTime: number) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          
          osc.frequency.setValueAtTime(1800, startTime);
          osc.frequency.exponentialRampToValueAtTime(3200, startTime + 0.08);
          osc.frequency.exponentialRampToValueAtTime(2200, startTime + 0.15);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.01, startTime);
          gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.16);
        };

        playChirp(now);
        playChirp(now + 0.2);
        playChirp(now + 0.4);

        setTimeout(() => onEnd?.(), 650);
        break;
      }

      case AnimalId.CONEJO: {
        // Synthesizing a cute rabbit squeak & sniff sound
        const playSqueak = (startTime: number) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(2400, startTime);
          osc.frequency.exponentialRampToValueAtTime(2100, startTime + 0.08);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.15, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.13);
        };

        const playSniff = (startTime: number) => {
          const noise = ctx.createBufferSource();
          noise.buffer = createNoiseBuffer(ctx, 0.1);
          
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 1600;
          filter.Q.value = 6;

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.08, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

          noise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          noise.start(startTime);
          noise.stop(startTime + 0.1);
        };

        playSniff(now);
        playSqueak(now + 0.12);
        playSniff(now + 0.28);
        playSqueak(now + 0.38);

        setTimeout(() => onEnd?.(), 600);
        break;
      }

      case AnimalId.TORTUGA: {
        // Synthesizing lettuce munching
        const playChomp = (startTime: number) => {
          const noise = ctx.createBufferSource();
          noise.buffer = createNoiseBuffer(ctx, 0.12);

          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(280, startTime);
          filter.frequency.exponentialRampToValueAtTime(150, startTime + 0.08);
          filter.Q.value = 2.5;

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.4, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

          noise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          noise.start(startTime);
          noise.stop(startTime + 0.12);
        };

        playChomp(now);
        playChomp(now + 0.22);
        playChomp(now + 0.44);

        setTimeout(() => onEnd?.(), 650);
        break;
      }

      case AnimalId.PEZ: {
        // Synthesizing bubbles
        const playBubble = (startTime: number) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(150, startTime);
          osc.frequency.exponentialRampToValueAtTime(750, startTime + 0.12);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.01, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.04);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.13);
        };

        playBubble(now);
        playBubble(now + 0.18);
        playBubble(now + 0.36);

        setTimeout(() => onEnd?.(), 600);
        break;
      }
    }
  } catch (error) {
    console.error("Fallo de audio sintetizado:", error);
    onEnd?.();
  }
}

/**
 * Helper to resolve dynamic URLs depending on the deployment platform.
 * With the addition of a native Vercel Serverless Function under /api/proxy-audio.ts,
 * we can always confidently use the platform-agnostic relative backend proxy on all environments.
 */
/**
 * Play a high-quality animal sound. First attempts to load and play recorded real-world audio,
 * and seamlessly falls back to our customized Web Audio synthesizer if offline or slow.
 */
export function playAnimalSynthesizedSound(id: AnimalId, onEnd?: () => void) {
  const realUrl = REAL_ANIMAL_SOUNDS[id];

  if (realUrl) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = realUrl;
    audio.volume = 1.0;

    let fallbackTriggered = false;
    let fallbackTimeoutId: any = null;

    const triggerFallback = (reason: string) => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        console.warn(`Fallback triggered for ${id}: ${reason}`);
        playBackWithSynth(id, onEnd);
      }
    };

    fallbackTimeoutId = setTimeout(() => {
      triggerFallback("Timeout waiting for audio file to load");
    }, 2000);

    audio.play()
      .then(() => {
        if (!fallbackTriggered) {
          clearTimeout(fallbackTimeoutId);
          fallbackTimeoutId = null;
        }
      })
      .catch((playError) => {
        console.warn(`Play error for ${id}:`, playError);
        if (playError.name === "NotAllowedError") {
          triggerFallback("User interaction restriction block");
        } else {
          triggerFallback("Load/Play failed");
        }
      });

    audio.onplaying = () => {
      if (!fallbackTriggered) {
        clearTimeout(fallbackTimeoutId);
        fallbackTimeoutId = null;
      }
    };

    audio.onended = () => {
      if (!fallbackTriggered) {
        onEnd?.();
      }
    };

    audio.onerror = () => {
      triggerFallback("Audio element load/network error");
    };

    return;
  }

  // Directly fallback to customized Web Audio synthesizer if no real recorded link provided
  playBackWithSynth(id, onEnd);
}

/**
 * Perform friendly Speech Synthesis in English for young children
 */
export function speakAnimalNameAndSound(
  name: string,
  onomatopoeia: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!("speechSynthesis" in window)) {
    onStart?.();
    setTimeout(() => onEnd?.(), 1000);
    return;
  }

  // Cancel any ongoing speaking
  window.speechSynthesis.cancel();

  // Create text-to-speech phrase: e.g. "Dog! The dog says Woof, woof!"
  // Let's keep it highly engaging, playful and clean:
  const textToSpeak = `${name}! The ${name.toLowerCase()} says ${onomatopoeia}`;
  
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = "en-US";
  utterance.rate = 0.9; // A bit slower and more cheerful for kids
  utterance.pitch = 1.25; // Higher, friendlier toddler voice!

  // Try to find a lovely English voice if possible
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (voice) => 
      voice.lang.includes("en-US") || 
      voice.lang.includes("en")
  );
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
