let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.2) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  step() {
    tone(200, 0.04, 'square', 0.05);
  },
  select() {
    tone(440, 0.1, 'sine', 0.15);
    setTimeout(() => tone(660, 0.1, 'sine', 0.15), 80);
  },
  confirm() {
    tone(523, 0.08, 'sine', 0.18);
    setTimeout(() => tone(659, 0.08, 'sine', 0.18), 80);
    setTimeout(() => tone(784, 0.15, 'sine', 0.18), 160);
  },
  correct() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => tone(f, 0.12, 'sine', 0.2), i * 80);
    });
  },
  wrong() {
    tone(220, 0.15, 'sawtooth', 0.18);
    setTimeout(() => tone(180, 0.2, 'sawtooth', 0.15), 120);
  },
  neutral() {
    tone(330, 0.1, 'sine', 0.12);
    setTimeout(() => tone(370, 0.15, 'sine', 0.12), 100);
  },
  nextChapter() {
    [261, 329, 392, 523, 659].forEach((f, i) => {
      setTimeout(() => tone(f, 0.18, 'sine', 0.22), i * 100);
    });
  },
  typeChar() {
    const freqs = [440, 494, 523, 587, 659, 698, 784];
    tone(freqs[Math.floor(Math.random() * freqs.length)], 0.02, 'square', 0.03);
  },
};

// Office ambient hum (very low volume continuous)
let ambientNode: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export function startAmbient() {
  try {
    const c = getCtx();
    ambientNode = c.createOscillator();
    ambientGain = c.createGain();
    ambientNode.type = 'sine';
    ambientNode.frequency.value = 60;
    ambientGain.gain.value = 0.02;
    ambientNode.connect(ambientGain);
    ambientGain.connect(c.destination);
    ambientNode.start();
  } catch {
    // audio not available
  }
}

export function stopAmbient() {
  try {
    ambientNode?.stop();
    ambientNode = null;
  } catch {
    // ignore
  }
}
