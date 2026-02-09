'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { toPigLatin, fromPigLatin, getExamples } from '@/lib/pig-latin'
import { getPigSoundPlayer, PigSoundPlayer } from '@/lib/pig-sounds'
import { getTranslations, defaultLocale, locales, localeNames, type Locale } from '@/lib/i18n'

export default function HomePage() {
  const t = getTranslations(defaultLocale)
  
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const pigSoundRef = useRef<PigSoundPlayer | null>(null)

  useEffect(() => {
    pigSoundRef.current = getPigSoundPlayer()
    return () => {
      pigSoundRef.current?.stop()
    }
  }, [])

  const examples = getExamples()

  const handleTranslate = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('')
      return
    }
    
    pigSoundRef.current?.playOink()
    
    const result = mode === 'encode' ? toPigLatin(inputText) : fromPigLatin(inputText)
    setOutputText(result)
  }, [inputText, mode])

  // Auto-translate on input change
  useEffect(() => {
    if (inputText.trim()) {
      const result = mode === 'encode' ? toPigLatin(inputText) : fromPigLatin(inputText)
      setOutputText(result)
    } else {
      setOutputText('')
    }
  }, [inputText, mode])

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setMode(newMode)
    // Swap input and output
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
  }

  const copyToClipboard = async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      pigSoundRef.current?.playSnort()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const playWithOinks = () => {
    if (!outputText || !pigSoundRef.current) return
    
    if (isPlaying) {
      pigSoundRef.current.stop()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      pigSoundRef.current.speakAsPig(outputText, () => setIsPlaying(false))
    }
  }

  const playOinkOnly = () => {
    pigSoundRef.current?.playCelebration()
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    pigSoundRef.current?.stop()
    setIsPlaying(false)
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.schema.orgName,
    url: t.schema.url,
    logo: 'https://piglatin.mrtranslator.app/logo.svg'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Use Pig Latin',
    description: 'Learn the rules of Pig Latin and translate your text',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Consonant Words',
        text: 'For words starting with consonants, move the first consonant cluster to the end and add "ay". Example: "hello" becomes "ellohay".'
      },
      {
        '@type': 'HowToStep',
        name: 'Vowel Words',
        text: 'For words starting with vowels, simply add "yay" to the end. Example: "apple" becomes "appleyay".'
      },
      {
        '@type': 'HowToStep',
        name: 'Special Cases',
        text: 'The "qu" combination is treated as a unit. Example: "question" becomes "estionquay".'
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-400 to-red-400">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🐷</span>
              <span>{t.header.title}</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/blog" className="text-white/80 hover:text-white transition">
                Blog
              </Link>
              <button
                onClick={playOinkOnly}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition flex items-center gap-2"
              >
                🔊 {t.translator.oink}
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            {t.header.title} 🐷
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {t.header.subtitle}
          </p>
          
          {/* Bouncing pigs */}
          <div className="flex justify-center gap-4 text-4xl mb-8">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🐷</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🐖</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐽</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎵</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
          </div>
        </section>

        {/* Translator Card */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Mode Toggle */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-center gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'encode'
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.translator.encodeMode}
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'decode'
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.translator.decodeMode}
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Input */}
              <div className="mb-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? "Hello, how are you today?" : "Ellohay, owhay areyay ouyay odaytay?"}
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all resize-none text-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={handleTranslate}
                  className="px-8 py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 text-white font-bold rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  🐷 {t.translator.translate}
                </button>
                <button
                  onClick={switchMode}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                  🔄 Swap
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-2xl hover:bg-gray-200 transition"
                >
                  {t.translator.clear}
                </button>
              </div>

              {/* Output */}
              {outputText && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-pink-700">Result:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={playWithOinks}
                        className={`px-4 py-2 rounded-lg transition flex items-center gap-2 font-semibold ${
                          isPlaying 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-white hover:bg-pink-100 text-pink-600'
                        }`}
                      >
                        {isPlaying ? (
                          <>⏹️ {t.translator.stop}</>
                        ) : (
                          <>🔊 {t.translator.playWithOinks}</>
                        )}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-white rounded-lg hover:bg-pink-100 transition font-semibold text-pink-600"
                      >
                        {copied ? '✓ ' + t.translator.copied : '📋 ' + t.translator.copy}
                      </button>
                    </div>
                  </div>
                  <p className="text-2xl leading-relaxed break-words font-medium text-gray-800">{outputText}</p>
                  
                  {/* Playing animation */}
                  {isPlaying && (
                    <div className="mt-4 flex justify-center gap-2 text-3xl">
                      <span className="animate-bounce">🐷</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎵</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐽</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎶</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐷</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white/10 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t.rules.title} 📚
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[t.rules.rule1, t.rules.rule2, t.rules.rule3].map((rule, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{rule.title}</h3>
                  <p className="text-gray-600 mb-4">{rule.description}</p>
                  <div className="bg-pink-50 rounded-xl p-4">
                    {rule.examples.map((ex, j) => (
                      <p key={j} className="font-mono text-sm text-pink-700">{ex}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t.features.title} 🏆
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.features.items.map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fun Facts */}
        <section className="bg-white/10 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t.funFacts.title} 🐷📖
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {t.funFacts.items.map((fact, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg flex gap-4">
                  <span className="text-4xl">{fact.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{fact.title}</h3>
                    <p className="text-gray-600">{fact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t.useCases.title} 🎯
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {t.useCases.items.map((useCase, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg flex gap-4">
                  <span className="text-3xl">{useCase.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{useCase.title}</h3>
                    <p className="text-gray-600 text-sm">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.faq.title}
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {t.faq.items.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://emoji.mrtranslator.app"
                className="px-8 py-4 bg-white text-pink-600 font-bold rounded-full hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {t.cta.emojiTranslator}
              </a>
              <a
                href="https://morse.mrtranslator.app"
                className="px-8 py-4 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition"
              >
                {t.cta.morseCode}
              </a>
              <a
                href="https://wingdings.mrtranslator.app"
                className="px-8 py-4 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition"
              >
                {t.cta.wingdings}
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-2xl mb-4">🐷 {t.header.title}</p>
            <p className="text-gray-400 mb-6">{t.footer.tagline}</p>
            
            {/* Language Selector */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={loc === defaultLocale ? '/' : `/${loc}`}
                  className={`text-sm ${loc === defaultLocale ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'} transition`}
                >
                  {localeNames[loc]}
                </Link>
              ))}
            </div>
            
            <div className="flex justify-center gap-6 mb-8">
              <Link href="/" className="text-gray-400 hover:text-white transition">{t.footer.links.home}</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition">{t.footer.links.blog}</Link>
            </div>
            
            <p className="text-gray-500 text-sm">{t.footer.copyright}</p>
          </div>
        </footer>
      </main>
    </>
  )
}
