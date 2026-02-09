import { NextResponse } from 'next/server';

const SITE_URL = 'https://emoji.mrtranslator.app';
const locales = ['en', 'es', 'fr', 'de', 'pt'];

export const revalidate = 300;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  
  // Homepage for each locale
  const urls = locales.map(locale => ({
    loc: locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
  }));

  // Add /blog for English only
  urls.push({
    loc: `${SITE_URL}/blog`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
