import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts, generateTOC, addHeadingIds } from '@/lib/blog'
import { getTranslations, defaultLocale } from '@/lib/i18n'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const t = getTranslations(defaultLocale)
  
  let post
  let relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = []
  
  try {
    post = await getPostBySlug(params.slug)
    if (post.categories?.length) {
      relatedPosts = await getRelatedPosts(
        post.categories.map(c => c.id),
        post.id,
        3
      )
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  const contentHtml = addHeadingIds(post.contentHtml || post.content || '')
  const toc = generateTOC(contentHtml)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage?.url,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() : 'Emoji Translator Team'
    }
  }

  const faqSchema = post.faqItems?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">😀</span>
              <span>{t.header.title}</span>
              <span className="text-white/70 font-normal">{t.header.subtitle}</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-white/90 hover:text-white transition-colors">
                Translator
              </Link>
              <Link href="/blog" className="text-white font-medium">
                {t.footer.blog}
              </Link>
            </nav>
          </div>
        </header>

        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Back Link */}
          <Link href="/blog" className="text-white/80 hover:text-white mb-8 inline-block">
            ← Back to Blog
          </Link>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                {/* Header */}
                <header className="mb-8">
                  {post.featuredImage?.url && (
                    <img
                      src={post.featuredImage.url}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {post.publishedAt.split('T')[0]}</span>
                    <span>⏱️ {post.readingTime} min read</span>
                    {post.author && (
                      <span>✍️ {post.author.firstName} {post.author.lastName}</span>
                    )}
                  </div>
                  {post.categories?.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.categories.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/blog/category/${cat.slug}`}
                          className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </header>

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-purple-600"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                {/* FAQ Section */}
                {post.faqItems && post.faqItems.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      {post.faqTitle || 'Frequently Asked Questions'}
                    </h2>
                    <div className="space-y-4">
                      {post.faqItems.map((faq, i) => (
                        <details key={i} className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-800">{faq.question}</span>
                            <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
                          </summary>
                          <div className="p-4 text-gray-600">{faq.answer}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-12 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Try Our Emoji Translator!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Convert text to emojis and emojis back to text instantly.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
                  >
                    Start Translating →
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Related Articles</h3>
                  <div className="grid gap-4">
                    {relatedPosts.map(rp => (
                      <Link
                        key={rp.id}
                        href={`/blog/${rp.slug}`}
                        className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        {rp.featuredImage?.url ? (
                          <img
                            src={rp.featuredImage.url}
                            alt={rp.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-2xl">
                            😀
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-800 hover:text-purple-600">{rp.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2">{rp.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar TOC */}
            {toc.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8 bg-white rounded-2xl p-4">
                  <h3 className="font-bold text-gray-800 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm text-gray-600 hover:text-purple-600 transition-colors ${
                          item.level === 3 ? 'pl-4' : ''
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </article>

        {/* Footer */}
        <footer className="text-center py-8 text-white/80 border-t border-white/20">
          <p>{t.footer.copyright}</p>
        </footer>
      </main>
    </>
  )
}
