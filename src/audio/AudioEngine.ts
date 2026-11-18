// ROOMTONE Web Audio API Synthesizer & Sound Effects Engine

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private crackleGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private crackleNode: AudioBufferSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  private isPlaying = false;
  private currentTrackId = 'track-1';
  private trackStartTime = 0;
  private playbackInterval: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onTrackEndCallback: (() => void) | null = null;

  private schedulerTimer: number | null = null;
  private currentStep = 0;
  private bpm = 116;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.75;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.musicGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);

      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.crackleGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.startCrackleGenerator();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private startCrackleGenerator() {
    if (!this.ctx || !this.crackleGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const whiteNoise = (Math.random() * 2 - 1) * 0.015;
        const isClick = Math.random() < 0.0006;
        const pop = isClick ? (Math.random() * 2 - 1) * 0.4 : 0;
        data[i] = whiteNoise + pop;
      }

      this.crackleNode = this.ctx.createBufferSource();
      this.crackleNode.buffer = buffer;
      this.crackleNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      this.crackleNode.connect(filter);
      filter.connect(this.crackleGain);
      this.crackleNode.start();
    } catch (e) {
      console.warn('Crackle setup error:', e);
    }
  }

  public setCrackleEnabled(enabled: boolean) {
    if (this.crackleGain && this.ctx) {
      this.crackleGain.gain.setValueAtTime(enabled ? 0.08 : 0, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.75, this.ctx.currentTime);
    }
  }

  public playSfx(type: 'click' | 'needle' | 'clack' | 'cd' | 'switch' | 'heart') {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    if (type === 'click') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(750, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.04);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'needle') {
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, t);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(t);
    } else if (type === 'clack') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.07);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'heart') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.setValueAtTime(659.25, t + 0.06);
      osc.frequency.setValueAtTime(783.99, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.35);
    } else {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  public playTrack(trackId: string, bpm: number, duration: number, _theme?: string, startOffset = 0) {
    this.initContext();
    this.currentTrackId = trackId;
    this.bpm = bpm;
    this.isPlaying = true;
    this.currentStep = Math.floor((startOffset / (60 / bpm / 4)) % 64);

    this.stopScheduler();
    this.trackStartTime = (this.ctx?.currentTime || 0) - startOffset;

    this.startScheduler();

    if (this.playbackInterval) clearInterval(this.playbackInterval);
    this.playbackInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const current = (this.ctx.currentTime - this.trackStartTime);
      if (current >= duration) {
        if (this.onTrackEndCallback) this.onTrackEndCallback();
      } else {
        if (this.onTimeUpdateCallback) this.onTimeUpdateCallback(current);
      }
    }, 150);
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.stopScheduler();
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  public seek(seconds: number, bpm: number, duration: number) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.playTrack(this.currentTrackId, bpm, duration, undefined, seconds);
    } else {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(seconds);
      }
    }
  }

  public onTimeUpdate(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onTrackEnd(cb: () => void) {
    this.onTrackEndCallback = cb;
  }

  public getAudioLevels(): { bass: number; mid: number; treble: number; overall: number } {
    if (!this.analyser || !this.dataArray || !this.isPlaying) {
      return { bass: 0, mid: 0, treble: 0, overall: 0 };
    }
    this.analyser.getByteFrequencyData(this.dataArray);

    let bassSum = 0;
    for (let i = 0; i < 4; i++) bassSum += this.dataArray[i];
    const bass = bassSum / (4 * 255);

    let midSum = 0;
    for (let i = 4; i < 16; i++) midSum += this.dataArray[i];
    const mid = midSum / (12 * 255);

    let trebleSum = 0;
    for (let i = 16; i < 32; i++) trebleSum += this.dataArray[i];
    const treble = trebleSum / (16 * 255);

    const overall = (bass * 0.5) + (mid * 0.3) + (treble * 0.2);
    return { bass, mid, treble, overall };
  }

  private noteFreq(note: string): number {
    const notes: Record<string, number> = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440;
  }

  private startScheduler() {
    if (!this.ctx) return;
    const stepDurationMs = (60 / this.bpm / 4) * 1000;

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      this.playStep(this.currentStep);
      this.currentStep = (this.currentStep + 1) % 64;
      this.schedulerTimer = window.setTimeout(tick, stepDurationMs);
    };

    tick();
  }

  private stopScheduler() {
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private playStep(step: number) {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;

    if (this.currentTrackId === 'track-1') {
      const melodyPattern = ['C5', '', 'E5', 'G5', 'C6', 'G5', 'E5', '', 'A4', '', 'C5', 'E5', 'A5', 'E5', 'C5', ''];
      const bassPattern = ['C3', '', '', '', 'C3', '', '', '', 'A3', '', '', '', 'A3', '', '', ''];
      const note = melodyPattern[step % 16];
      if (note) this.playTone(this.noteFreq(note), 'square', 0.12, 0.08, t);
      const bass = bassPattern[step % 16];
      if (bass) this.playTone(this.noteFreq(bass), 'triangle', 0.22, 0.14, t);
      if (step % 8 === 0) this.playKick(t, 0.15);
      if (step % 16 === 8) this.playSnare(t, 0.1);
    } else if (this.currentTrackId === 'track-2') {
      if (step % 16 === 0) {
        ['F4', 'A4', 'C5', 'E5'].forEach((n, idx) => {
          setTimeout(() => this.playTone(this.noteFreq(n), 'sine', 0.6, 0.12, this.ctx?.currentTime || 0), idx * 30);
        });
      }
      if (step % 16 === 0 || step % 16 === 10) this.playKick(t, 0.2);
      if (step % 16 === 8) this.playSnare(t, 0.12);
    } else if (this.currentTrackId === 'track-3') {
      const cyberLead = ['A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'D5'];
      const n = cyberLead[step % 8];
      if (n) this.playTone(this.noteFreq(n), 'sawtooth', 0.1, 0.1, t);
      if (step % 4 === 0) this.playKick(t, 0.25);
    } else {
      const melody = ['G4', 'E5', 'D5', 'C5', 'D5', 'E5', 'G5', ''];
      const n = melody[step % 8];
      if (n) this.playTone(this.noteFreq(n), 'square', 0.14, 0.12, t);
      if (step % 8 === 0) this.playKick(t, 0.2);
    }
  }

  private playTone(freq: number, type: OscillatorType, dur: number, vol: number, time: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + dur);
  }

  private playKick(time: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  private playSnare(time: number, vol: number) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    noise.start(time);
  }
}

export const audioEngine = new RetroAudioEngine();
