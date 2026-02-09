import Link from 'next/link'
import { getPosts } from '@/lib/blog'
import { getTranslations, defaultLocale, locales, localeNames } from '@/lib/i18n'

export const revalidate = 60

export default async function BlogPage() {
  const t = getTranslations(defaultLocale)
  
  let posts: Awaited<ReturnType<typeof getPosts>>['data'] = []
  
  try {
    const response = await getPosts(1, 20)
    posts = response.data
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }

  return (
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📝 {t.footer.blog}
          </h1>
          <p className="text-white/90 text-lg">
            Learn about emojis, their history, and how to use them effectively
          </p>
        </div>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  {post.featuredImage?.url ? (
                    <img 
                      src={post.featuredImage.url} 
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-4xl">
                      😀
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {post.publishedAt.split('T')[0]}</span>
                      <span>⏱️ {post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h2>
            <p className="text-gray-600">Blog posts will appear here once published.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/80 border-t border-white/20">
        <p>{t.footer.copyright}</p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/blog" className="hover:text-white">{t.footer.blog}</Link>
        </div>
        {/* Language Links */}
        <div className="mt-6 flex justify-center flex-wrap gap-3 text-sm">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={loc === 'en' ? '/blog' : `/${loc}/blog`}
              className={`px-3 py-1 rounded-full transition-colors ${
                loc === 'en' ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              {localeNames[loc]}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  )
}
