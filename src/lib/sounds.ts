class SoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private invincibleOsc: OscillatorNode | null = null;
  private invincibleGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported', e);
      }
    }
    // Resume context if suspended (browser auto-play policy)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Funny boing sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLand() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Soft thud
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08); 
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playHit() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Ouch / bonk
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.linearRampToValueAtTime(150, t + 0.1); 
    osc.frequency.linearRampToValueAtTime(200, t + 0.2); 
    osc.frequency.linearRampToValueAtTime(100, t + 0.3); 
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playFall() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Descending whistle
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 1.2); 
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
    
    osc.start(t);
    osc.stop(t + 1.2);
  }

  playStomp() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Funny boop/pop sound for squishing enemy
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playCollectBroccoli() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Quick high-pitched "blip"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playCorrect() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const playNote = (freq: number, startOff: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + startOff);
        gain.gain.linearRampToValueAtTime(0.2, t + startOff + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + startOff + 0.3);
        osc.start(t + startOff);
        osc.stop(t + startOff + 0.3);
    };

    // Happy chime
    playNote(523.25, 0); // C5
    playNote(659.25, 0.1); // E5
    playNote(783.99, 0.2); // G5
    playNote(1046.50, 0.3); // C6
  }

  playPowerup() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const playNote = (freq: number, startOff: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + startOff);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + startOff + 0.1);
        gain.gain.setValueAtTime(0.2, t + startOff);
        gain.gain.exponentialRampToValueAtTime(0.01, t + startOff + 0.15);
        osc.start(t + startOff);
        osc.stop(t + startOff + 0.15);
    };

    playNote(440, 0);
    playNote(554, 0.1);
    playNote(659, 0.2);
    playNote(880, 0.3);
  }

  playWrong() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const playWah = (freq: number, startOff: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + startOff);
        osc.frequency.linearRampToValueAtTime(freq - 30, t + startOff + 0.3);
        gain.gain.setValueAtTime(0.2, t + startOff);
        gain.gain.linearRampToValueAtTime(0.01, t + startOff + 0.3);
        osc.start(t + startOff);
        osc.stop(t + startOff + 0.3);
    };

    // Wah wah wah
    playWah(300, 0);
    playWah(280, 0.3);
    playWah(250, 0.6);
    
    // Final long wah
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t + 0.9);
    osc.frequency.linearRampToValueAtTime(100, t + 1.5);
    gain.gain.setValueAtTime(0.2, t + 0.9);
    gain.gain.linearRampToValueAtTime(0.01, t + 1.5);
    osc.start(t + 0.9);
    osc.stop(t + 1.5);
  }
  
  playReachEnemy() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const playNote = (freq: number, startOff: number, dur: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + startOff);
        gain.gain.linearRampToValueAtTime(0.1, t + startOff + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + startOff + dur);
        osc.start(t + startOff);
        osc.stop(t + startOff + dur);
    };

    // Boss warning retro sound
    playNote(220, 0, 0.2); 
    playNote(220, 0.2, 0.2);
    playNote(330, 0.4, 0.4);
  }
  
  playVictory() {
    this.init();
    this.playCorrect();
    setTimeout(() => this.playCorrect(), 400);
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, t);
      osc.frequency.linearRampToValueAtTime(2093.00, t + 0.5);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    }, 800);
  }

  playInvincibleMusic() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    this.stopInvincibleMusic();
    
    const t = this.ctx.currentTime;
    
    // Anime heroic theme (E minor fast paced)
    const n = {
      E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63,
      E5: 659.25, Fs5: 739.99, G5: 783.99, A5: 880.00, B5: 987.77, C6: 1046.50, D6: 1174.66, E6: 1318.51
    };
    
    const melody = [
      n.E5, n.E5, n.G5, n.A5, n.B5, n.A5, n.G5, n.E5,
      n.C6, n.C6, n.C6, n.B5, n.A5, n.B5, n.A5, n.G5,
      n.D6, n.D6, n.D6, n.C6, n.B5, n.C6, n.B5, n.A5,
      n.B5, n.B5, n.B5, n.A5, n.G5, n.Fs5, n.G5, n.Fs5
    ];
    
    const bass = [
      n.E4, n.E4, n.E3, n.E4, n.E4, n.E3, n.E4, n.E3,
      n.C4, n.C4, n.C4, n.G3, n.C4, n.C4, n.G3, n.C4,
      n.D4, n.D4, n.D4, n.A3, n.D4, n.D4, n.A3, n.D4,
      n.B3, n.B3, n.B3, n.Fs5, n.B3, n.B3, n.B3, n.Fs5 
    ];

    const noteLen = 0.125;
    const duration = 10;

    const oscLead = this.ctx.createOscillator();
    const gainLead = this.ctx.createGain();
    oscLead.type = 'square';
    oscLead.connect(gainLead);
    gainLead.connect(this.ctx.destination);

    const oscBass = this.ctx.createOscillator();
    const gainBass = this.ctx.createGain();
    oscBass.type = 'sawtooth';
    oscBass.connect(gainBass);
    gainBass.connect(this.ctx.destination);

    for (let i = 0; i < duration; i += noteLen) {
      const idx = Math.floor((i / noteLen)) % melody.length;
      
      if (melody[idx]) {
        oscLead.frequency.setValueAtTime(melody[idx], t + i);
        gainLead.gain.setValueAtTime(0, t + i);
        gainLead.gain.linearRampToValueAtTime(0.06, t + i + 0.02);
        gainLead.gain.linearRampToValueAtTime(0.04, t + i + noteLen - 0.01);
        gainLead.gain.linearRampToValueAtTime(0, t + i + noteLen);
      } else {
        gainLead.gain.setValueAtTime(0, t + i);
      }
      
      if (bass[idx % bass.length]) {
        oscBass.frequency.setValueAtTime(bass[idx % bass.length], t + i);
        gainBass.gain.setValueAtTime(0, t + i);
        gainBass.gain.linearRampToValueAtTime(0.08, t + i + 0.01);
        gainBass.gain.linearRampToValueAtTime(0.06, t + i + noteLen - 0.02);
        gainBass.gain.linearRampToValueAtTime(0, t + i + noteLen);
      } else {
        gainBass.gain.setValueAtTime(0, t + i);
      }
    }
    
    oscLead.start(t);
    oscLead.stop(t + duration);
    oscBass.start(t);
    oscBass.stop(t + duration);
    
    this.invincibleOsc = oscLead;
    (this as any).invincibleOscBass = oscBass;
    this.invincibleGain = gainLead;
    (this as any).invincibleGainBass = gainBass;
  }
  
  stopInvincibleMusic() {
    if (this.invincibleOsc) {
      try { this.invincibleOsc.stop(); this.invincibleOsc.disconnect(); } catch (e) {}
      this.invincibleOsc = null;
    }
    if ((this as any).invincibleOscBass) {
      try { (this as any).invincibleOscBass.stop(); (this as any).invincibleOscBass.disconnect(); } catch (e) {}
      (this as any).invincibleOscBass = null;
    }
    if (this.invincibleGain) {
      try { this.invincibleGain.disconnect(); } catch (e) {}
      this.invincibleGain = null;
    }
    if ((this as any).invincibleGainBass) {
      try { (this as any).invincibleGainBass.disconnect(); } catch (e) {}
      (this as any).invincibleGainBass = null;
    }
  }
}

export const sfx = new SoundFX();
