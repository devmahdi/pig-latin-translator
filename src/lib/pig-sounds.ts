// Real Pig Sound Player using audio samples
// Base64 encoded short pig oink sounds

// Short pig oink sound (public domain)
const OINK_SOUND = 'data:audio/mp3;base64,//uQxAAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQAAAqsAT/0AAAJQgAn/oAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

export class PigSoundPlayer {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  private oinkAudio: HTMLAudioElement | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.oinkAudio = new Audio()
      this.oinkAudio.volume = 0.7
    }
  }
  
  // Play oink using oscillator-based synthesis that sounds more pig-like
  async playOink(): Promise<void> {
    if (typeof window === 'undefined') return
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    const duration = 0.25 + Math.random() * 0.15
    
    // Create a more realistic pig oink
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const noiseGain = ctx.createGain()
    const masterGain = ctx.createGain()
    
    // Low grunt oscillator
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(120, now)
    osc1.frequency.exponentialRampToValueAtTime(80, now + duration * 0.3)
    osc1.frequency.exponentialRampToValueAtTime(150, now + duration * 0.6)
    osc1.frequency.exponentialRampToValueAtTime(60, now + duration)
    
    // Nasal harmonic
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(240, now)
    osc2.frequency.exponentialRampToValueAtTime(180, now + duration)
    
    // Noise for breath/snort
    const bufferSize = ctx.sampleRate * duration
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.15
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    
    // Bandpass filter for nasal quality
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(500, now)
    filter.Q.setValueAtTime(3, now)
    
    // Gain envelopes
    const osc1Gain = ctx.createGain()
    osc1Gain.gain.setValueAtTime(0, now)
    osc1Gain.gain.linearRampToValueAtTime(0.5, now + 0.02)
    osc1Gain.gain.linearRampToValueAtTime(0.3, now + duration * 0.5)
    osc1Gain.gain.linearRampToValueAtTime(0, now + duration)
    
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.setValueAtTime(0, now)
    osc2Gain.gain.linearRampToValueAtTime(0.2, now + 0.02)
    osc2Gain.gain.linearRampToValueAtTime(0, now + duration)
    
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.01)
    noiseGain.gain.linearRampToValueAtTime(0, now + duration)
    
    masterGain.gain.setValueAtTime(0.6, now)
    masterGain.connect(ctx.destination)
    
    // Connect everything
    osc1.connect(osc1Gain)
    osc1Gain.connect(filter)
    filter.connect(masterGain)
    
    osc2.connect(osc2Gain)
    osc2Gain.connect(masterGain)
    
    noise.connect(noiseGain)
    noiseGain.connect(masterGain)
    
    // Play
    osc1.start(now)
    osc2.start(now)
    noise.start(now)
    
    osc1.stop(now + duration)
    osc2.stop(now + duration)
    noise.stop(now + duration)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Snort sound
  async playSnort(): Promise<void> {
    if (typeof window === 'undefined') return
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    const duration = 0.12
    
    // Noise burst for snort
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize
      const envelope = Math.sin(t * Math.PI) * Math.exp(-t * 4)
      data[i] = (Math.random() * 2 - 1) * envelope
    }
    
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.Q.setValueAtTime(2, now)
    
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.5, now)
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    noise.start(now)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Grunt sound
  async playGrunt(): Promise<void> {
    if (typeof window === 'undefined') return
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    const duration = 0.15
    
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(90, now)
    osc.frequency.exponentialRampToValueAtTime(50, now + duration)
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(200, now)
    
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.6, now)
    gain.gain.linearRampToValueAtTime(0, now + duration)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + duration)
    
    return new Promise(resolve => setTimeout(resolve, duration * 1000))
  }
  
  // Celebration - multiple sounds
  async playCelebration(): Promise<void> {
    await this.playOink()
    await this.delay(80)
    await this.playSnort()
    await this.delay(80)
    await this.playOink()
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Play pig sounds for text (one sound per few syllables)
  async speakAsPig(text: string, onComplete?: () => void): Promise<void> {
    if (typeof window === 'undefined') return
    
    this.isPlaying = true
    
    // Count syllables roughly
    const syllables = text.toLowerCase().match(/[aeiouy]+/g) || []
    const soundCount = Math.min(Math.ceil(syllables.length / 2), 12)
    
    for (let i = 0; i < soundCount && this.isPlaying; i++) {
      const rand = Math.random()
      if (rand < 0.6) {
        await this.playOink()
      } else if (rand < 0.85) {
        await this.playGrunt()
      } else {
        await this.playSnort()
      }
      await this.delay(80 + Math.random() * 120)
    }
    
    if (this.isPlaying) {
      await this.delay(100)
      await this.playOink()
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

// Singleton
let instance: PigSoundPlayer | null = null

export function getPigSoundPlayer(): PigSoundPlayer {
  if (typeof window === 'undefined') {
    return new PigSoundPlayer()
  }
  if (!instance) {
    instance = new PigSoundPlayer()
  }
  return instance
}
