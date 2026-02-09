// Realistic Pig Sound Player using Web Audio API
// Creates actual pig-like oinks, not human speech!

export class PigSoundPlayer {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }
  
  // Realistic pig oink using formant synthesis
  async playOink(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const duration = 0.3 + Math.random() * 0.2
    
    // Master gain
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    masterGain.gain.setValueAtTime(0.4, now)
    
    // Main oscillator - low grunting frequency
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(80 + Math.random() * 40, now)
    osc1.frequency.exponentialRampToValueAtTime(60, now + duration * 0.3)
    osc1.frequency.exponentialRampToValueAtTime(100 + Math.random() * 50, now + duration * 0.5)
    osc1.frequency.exponentialRampToValueAtTime(50, now + duration)
    
    // Second oscillator for harmonic richness
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(160 + Math.random() * 60, now)
    osc2.frequency.exponentialRampToValueAtTime(120, now + duration * 0.5)
    osc2.frequency.exponentialRampToValueAtTime(80, now + duration)
    
    // Nasal resonance filter
    const nasalFilter = ctx.createBiquadFilter()
    nasalFilter.type = 'bandpass'
    nasalFilter.frequency.setValueAtTime(800, now)
    nasalFilter.Q.setValueAtTime(5, now)
    
    // Low rumble filter
    const lowFilter = ctx.createBiquadFilter()
    lowFilter.type = 'lowpass'
    lowFilter.frequency.setValueAtTime(400, now)
    lowFilter.Q.setValueAtTime(2, now)
    
    // Gain envelopes
    const osc1Gain = ctx.createGain()
    osc1Gain.gain.setValueAtTime(0, now)
    osc1Gain.gain.linearRampToValueAtTime(0.6, now + 0.02)
    osc1Gain.gain.linearRampToValueAtTime(0.4, now + duration * 0.5)
    osc1Gain.gain.linearRampToValueAtTime(0, now + duration)
    
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.setValueAtTime(0, now)
    osc2Gain.gain.linearRampToValueAtTime(0.3, now + 0.02)
    osc2Gain.gain.linearRampToValueAtTime(0, now + duration)
    
    // Connect osc1 path
    osc1.connect(osc1Gain)
    osc1Gain.connect(lowFilter)
    lowFilter.connect(masterGain)
    
    // Connect osc2 path
    osc2.connect(osc2Gain)
    osc2Gain.connect(nasalFilter)
    nasalFilter.connect(masterGain)
    
    // Add noise burst for snort texture
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3
    }
    
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(300, now)
    noiseFilter.Q.setValueAtTime(1, now)
    
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.01)
    noiseGain.gain.linearRampToValueAtTime(0.05, now + duration * 0.3)
    noiseGain.gain.linearRampToValueAtTime(0, now + duration)
    
    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    
    // Start all
    osc1.start(now)
    osc2.start(now)
    noiseSource.start(now)
    
    osc1.stop(now + duration)
    osc2.stop(now + duration)
    noiseSource.stop(now + duration)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Pig snort - breathy nasal sound
  async playSnort(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const duration = 0.15 + Math.random() * 0.1
    
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    masterGain.gain.setValueAtTime(0.5, now)
    
    // Noise-based snort
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      // Amplitude envelope - quick attack, decay
      const t = i / bufferSize
      const envelope = Math.sin(t * Math.PI) * Math.exp(-t * 3)
      data[i] = (Math.random() * 2 - 1) * envelope
    }
    
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    // Nasal resonance
    const filter1 = ctx.createBiquadFilter()
    filter1.type = 'bandpass'
    filter1.frequency.setValueAtTime(600 + Math.random() * 200, now)
    filter1.Q.setValueAtTime(8, now)
    
    const filter2 = ctx.createBiquadFilter()
    filter2.type = 'lowpass'
    filter2.frequency.setValueAtTime(1500, now)
    
    noise.connect(filter1)
    filter1.connect(filter2)
    filter2.connect(masterGain)
    
    noise.start(now)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Pig squeal - higher pitched excited sound
  async playSqueal(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const duration = 0.4 + Math.random() * 0.2
    
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    masterGain.gain.setValueAtTime(0.25, now)
    
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300 + Math.random() * 100, now)
    osc.frequency.exponentialRampToValueAtTime(500 + Math.random() * 200, now + duration * 0.3)
    osc.frequency.exponentialRampToValueAtTime(200, now + duration)
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1000, now)
    filter.Q.setValueAtTime(3, now)
    
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.8, now + 0.03)
    gain.gain.linearRampToValueAtTime(0.5, now + duration * 0.5)
    gain.gain.linearRampToValueAtTime(0, now + duration)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)
    
    osc.start(now)
    osc.stop(now + duration)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Pig grunt - short low sound
  async playGrunt(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    const duration = 0.1 + Math.random() * 0.05
    
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    masterGain.gain.setValueAtTime(0.5, now)
    
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100 + Math.random() * 30, now)
    osc.frequency.exponentialRampToValueAtTime(70, now + duration)
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(300, now)
    filter.Q.setValueAtTime(5, now)
    
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.8, now)
    gain.gain.linearRampToValueAtTime(0, now + duration)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)
    
    osc.start(now)
    osc.stop(now + duration)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Combined pig celebration - multiple sounds
  async playCelebration(): Promise<void> {
    await this.playOink()
    await this.delay(100)
    await this.playSnort()
    await this.delay(50)
    await this.playOink()
    await this.delay(100)
    await this.playSqueal()
  }
  
  // Play random pig sound
  async playRandom(): Promise<void> {
    const sounds = [this.playOink, this.playSnort, this.playGrunt, this.playSqueal]
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
    await randomSound.call(this)
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Play text with pig sounds (no human speech - just pig sounds representing syllables!)
  async speakAsPig(text: string, onComplete?: () => void): Promise<void> {
    if (typeof window === 'undefined') return
    
    this.isPlaying = true
    
    // Count syllables roughly (vowel groups)
    const syllables = text.toLowerCase().match(/[aeiouy]+/g) || []
    const soundCount = Math.min(syllables.length, 20) // Cap at 20 sounds
    
    for (let i = 0; i < soundCount && this.isPlaying; i++) {
      // Vary the sounds
      const rand = Math.random()
      if (rand < 0.5) {
        await this.playOink()
      } else if (rand < 0.7) {
        await this.playGrunt()
      } else if (rand < 0.9) {
        await this.playSnort()
      } else {
        await this.playSqueal()
      }
      
      // Small pause between sounds
      await this.delay(50 + Math.random() * 100)
    }
    
    // End with celebration
    if (this.isPlaying) {
      await this.delay(200)
      await this.playOink()
      await this.playSnort()
    }
    
    this.isPlaying = false
    if (onComplete) onComplete()
  }
  
  stop(): void {
    this.isPlaying = false
  }
  
  getIsPlaying(): boolean {
    return this.isPlaying
  }
}

// Singleton instance
let pigSoundInstance: PigSoundPlayer | null = null

export function getPigSoundPlayer(): PigSoundPlayer {
  if (typeof window === 'undefined') {
    return new PigSoundPlayer() // SSR fallback
  }
  if (!pigSoundInstance) {
    pigSoundInstance = new PigSoundPlayer()
  }
  return pigSoundInstance
}
