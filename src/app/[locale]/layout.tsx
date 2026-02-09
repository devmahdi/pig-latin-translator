import type { Metadata } from 'next'
import { getTranslations, locales, localeNames, type Locale } from '@/lib/i18n'

const siteUrl = 'https://piglatin.mrtranslator.app'

type Props = {
  params: { locale: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale
  const t = getTranslations(locale)
  
  // Build hreflang alternates
  const languages: Record<string, string> = {
    'x-default': siteUrl,
  }
  locales.forEach((loc) => {
    languages[loc] = loc === 'en' ? siteUrl : `${siteUrl}/${loc}`
  })

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `${siteUrl}/${locale}`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return locales.filter(l => l !== 'en').map((locale) => ({ locale }))
}

export default function LocaleLayout({ children }: Props) {
  return <>{children}</>
}
