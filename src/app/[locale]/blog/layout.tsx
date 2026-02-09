import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'

const siteUrl = 'https://piglatin.mrtranslator.app'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale
  
  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/blog`,
  }
  locales.forEach((loc) => {
    languages[loc] = loc === 'en' ? `${siteUrl}/blog` : `${siteUrl}/${loc}/blog`
  })

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages,
    },
  }
}

export default function LocaleBlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
