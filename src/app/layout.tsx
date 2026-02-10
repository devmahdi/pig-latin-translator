import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://piglatin.mrtranslator.app'

export const metadata: Metadata = {
  title: 'Pig Latin Translator – Free Online Converter',
  description: 'Free online Pig Latin translator. Convert English to Pig Latin or decode Pig Latin to English instantly. A classic language game used for fun and education.',
  keywords: 'pig latin translator, pig latin converter, english to pig latin, pig latin decoder, pig latin generator, language game, word game, free translator',
  verification: {
    google: 'd3B3MMKaKwk3jPu_BFy4j7ePJ1rfINIlt-mnKSRwCqA',
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': siteUrl,
      'es': `${siteUrl}/es`,
      'fr': `${siteUrl}/fr`,
      'de': `${siteUrl}/de`,
      'pt': `${siteUrl}/pt`,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    title: 'Pig Latin Translator – Free Online Converter',
    description: 'Free online Pig Latin translator. Convert English to Pig Latin or decode Pig Latin to English instantly.',
    url: siteUrl,
    siteName: 'MrTranslator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pig Latin Translator',
    description: 'Free online Pig Latin translator. Convert English to Pig Latin instantly.',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-54VD1PBDGX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-54VD1PBDGX');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
