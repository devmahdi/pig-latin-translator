'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { toPigLatin, fromPigLatin, getExamples } from '@/lib/pig-latin'
import { getTranslations, defaultLocale, locales, localeNames, type Locale } from '@/lib/i18n'

export default function HomePage() {
  const t = getTranslations(defaultLocale)
  
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [showExamples, setShowExamples] = useState(false)

  const examples = getExamples()

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
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
  }

  const copyToClipboard = async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pig Latin Translator by MrTranslator',
    url: 'https://piglatin.mrtranslator.app',
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
      
      <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🔤</span>
              <span>{t.header.title}</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/blog" className="text-white/80 hover:text-white transition">
                Blog
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            {t.header.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t.meta.description}
          </p>
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.translator.encodeMode}
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'decode'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.translator.decodeMode}
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'encode' ? 'English Text' : 'Pig Latin Text'}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? "Enter English text here..." : "Enter Pig Latin text here..."}
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none text-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
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
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="px-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-100 transition"
                >
                  📚 Examples
                </button>
              </div>

              {/* Examples Panel */}
              {showExamples && (
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-700 mb-3">Translation Examples:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {examples.slice(0, 9).map((ex, i) => (
                      <div key={i} className="text-sm p-2 bg-white rounded-lg">
                        <span className="text-gray-500">{ex.english}</span>
                        <span className="mx-2">→</span>
                        <span className="text-indigo-600 font-medium">{ex.pigLatin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Output */}
              {outputText && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-indigo-700">
                      {mode === 'encode' ? 'Pig Latin' : 'English'}
                    </label>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-white rounded-lg hover:bg-indigo-100 transition font-semibold text-indigo-600"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <p className="text-xl leading-relaxed break-words font-medium text-gray-800">{outputText}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white/10 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              {t.rules.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[t.rules.rule1, t.rules.rule2, t.rules.rule3].map((rule, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{rule.title}</h3>
                  <p className="text-gray-600 mb-4">{rule.description}</p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    {rule.examples.map((ex, j) => (
                      <p key={j} className="font-mono text-sm text-indigo-700">{ex}</p>
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
              {t.features.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.features.items.map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
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
              {t.funFacts.title}
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
              {t.useCases.title}
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

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-2xl mb-4">🔤 {t.header.title}</p>
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
