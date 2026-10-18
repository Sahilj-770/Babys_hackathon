// Pure Web Audio API Sound Engine
// Safe, self-contained, zero external audio asset dependencies, with strict mute handling & autoplay compliance

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hasUserInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.hasUserInteracted = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  private initContext(): boolean {
    if (this.isMuted) return false;

    // Strict autoplay compliance: wait for explicit user gesture
    if (!this.hasUserInteracted && typeof navigator !== 'undefined' && 'userActivation' in navigator) {
      const activation = (navigator as unknown as { userActivation?: { hasBeenActive: boolean } }).userActivation;
      if (activation && !activation.hasBeenActive) {
        return false;
      }
    }

    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return !!this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Play a soft, dreamy music-box bell tone
  public playMusicBoxNote(freq: number, duration: number = 1.2) {
    if (this.isMuted) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dreamy sine-triangle blend
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      // Fast glassy attack
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      // Gentle exponential release
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  // Soft retro button click / chirp
  public playClick(pitch: number = 440) {
    if (this.isMuted) return;
    try {
      if (!this.initContext() || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  // Sparkly celebration chime for Easter Egg
  public playCelebrationChime() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 1.4);
      }, idx * 110);
    });
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
