// js/components/audioManager.js
// Web Audio API-ზე დაფუძნებული ხმოვანი ეფექტები (ქაღალდის შრიალი, ფანქრის ხაზვა, pop-click)

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('vako_audio_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('vako_audio_volume') || '0.5');
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.isInitialized = true;
      }
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('vako_audio_muted', this.isMuted);
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    localStorage.setItem('vako_audio_volume', this.volume);
  }

  // 1. ქაღალდის გახევის ხმა (Paper Tear)
  playPaperTear() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const duration = 0.55;
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // White noise with envelope for rip/tear effect
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = Math.sin(t * Math.PI) * (Math.random() > 0.3 ? 1 : 0.4);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for realistic paper tearing texture
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.8, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, this.audioCtx.currentTime + duration);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.45, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // 2. ფანქრის ხაზვის ხმა (Pencil Scratch / Hover)
  playPencilScratch() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const duration = 0.08;
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // 3. Pop / Click ეფექტი ღილაკებზე
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn('Click sound error', e);
    }
  }

  playAudioFile(src, volumeScale = 1.0) {
    if (this.isMuted) return;
    try {
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, this.volume * volumeScale));
      audio.play().catch(() => {});
    } catch (e) {}
  }

  playDoorOpen() {
    this.playAudioFile('assets/sounds/otwarciedrzwi.mp3', 0.9);
  }

  playDoorClose() {
    this.playAudioFile('assets/sounds/zamknieciedrzwi.mp3', 0.85);
  }

  playDoorCreak() {
    this.playAudioFile('assets/sounds/uchyleniedrzwi.mp3', 0.8);
  }

  playPaperRustle() {
    this.playAudioFile('assets/sounds/cfl_turningpages-belem-breeze-487596.ogg', 0.7);
  }
}

export const soundEngine = new AudioManager();

