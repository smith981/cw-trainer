let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playChaChing(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Two quick ascending bright tones
  [800, 1200].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.25);
  });
}

// --- CW key tone (held while pressing) ---

let cwOsc: OscillatorNode | null = null;
let cwGain: GainNode | null = null;

export function startKeyTone(): void {
  const ctx = getAudioContext();
  if (cwOsc) return; // already playing

  cwOsc = ctx.createOscillator();
  cwGain = ctx.createGain();
  cwOsc.type = 'sine';
  cwOsc.frequency.value = 660;
  cwGain.gain.setValueAtTime(0.25, ctx.currentTime);
  cwOsc.connect(cwGain);
  cwGain.connect(ctx.destination);
  cwOsc.start();
}

export function stopKeyTone(): void {
  if (!cwGain || !cwOsc) return;
  const ctx = getAudioContext();
  cwGain.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
  cwOsc.stop(ctx.currentTime + 0.05);
  cwOsc = null;
  cwGain = null;
}

export function playBuzzer(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 150;
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}
