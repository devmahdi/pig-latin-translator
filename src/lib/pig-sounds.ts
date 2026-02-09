// Pig Sound Player using Web Audio API
export class PigSoundPlayer {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }
  
  // Oink sound synthesis
  async playOink(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // Create oscillator for oink
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
    
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.25)
  }
  
  // Snort sound
  async playSnort(): Promise<void> {
    const ctx = this.getContext()
    const now = ctx.currentTime
    
    // White noise for snort
    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
    }
    
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    // Filter for snort character
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, now)
    
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.4, now)
    
    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    noise.start(now)
  }
  
  // Combined pig celebration sound
  async playCelebration(): Promise<void> {
    await this.playOink()
    setTimeout(() => this.playSnort(), 200)
    setTimeout(() => this.playOink(), 400)
  }
  
  // Speak text with pig sounds interspersed
  async speakWithOinks(text: string, onComplete?: () => void): Promise<void> {
    if (typeof window === 'undefined') return
    
    this.isPlaying = true
    const words = text.split(/\s+/)
    
    // Play initial oink
    await this.playOink()
    
    let wordIndex = 0
    
    const speakNext = () => {
      if (!this.isPlaying || wordIndex >= words.length) {
        this.isPlaying = false
        this.playCelebration()
        if (onComplete) onComplete()
        return
      }
      
      // Speak a chunk of 2-4 words
      const chunkSize = Math.floor(Math.random() * 3) + 2
      const chunk = words.slice(wordIndex, wordIndex + chunkSize).join(' ')
      wordIndex += chunkSize
      
      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.rate = 0.85
      utterance.pitch = 1.1 // Slightly higher pitch for fun
      
      utterance.onend = () => {
        // Random chance to play oink between chunks
        if (Math.random() > 0.5 && wordIndex < words.length) {
          setTimeout(() => {
            this.playOink()
            setTimeout(speakNext, 300)
          }, 100)
        } else {
          setTimeout(speakNext, 200)
        }
      }
      
      window.speechSynthesis.speak(utterance)
    }
    
    setTimeout(speakNext, 300)
  }
  
  stop(): void {
    this.isPlaying = false
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
    }
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
