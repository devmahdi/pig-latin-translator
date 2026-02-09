import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://piglatin.mrtranslator.app'

export const metadata: Metadata = {
  title: 'Pig Latin Translator – Free Online Converter with Sound Effects',
  description: 'Free Pig Latin translator with fun pig sounds! Convert English to Pig Latin or decode Pig Latin to English instantly. Play your translations with authentic oink effects.',
  keywords: 'pig latin translator, pig latin converter, english to pig latin, pig latin decoder, pig latin generator, pig latin with sound, free pig latin tool',
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
    title: 'Pig Latin Translator – Free Online Converter with Sound Effects',
    description: 'Free Pig Latin translator with fun pig sounds! Convert English to Pig Latin instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pig Latin Translator',
    description: 'Free Pig Latin translator with fun pig sounds! Convert English to Pig Latin instantly.',
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
          src="https://www.googletagmanager.com/gtag/js?id=G-YY86GZ1G27"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YY86GZ1G27');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
