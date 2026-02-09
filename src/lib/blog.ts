const API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'https://cms-micros.kimura.team/api';
const API_KEY = process.env.CMS_API_KEY || '';
const SITE_ID = process.env.SITE_ID || '';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  featuredImage?: {
    url: string;
  };
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  faqTitle?: string;
  faqItems?: { question: string; answer: string }[];
  publishedAt: string;
  readingTime: number;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface PostsResponse {
  data: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'x-api-key': API_KEY,
      'x-site-id': SITE_ID,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function getPosts(page = 1, limit = 10): Promise<PostsResponse> {
  return fetchAPI<PostsResponse>(`/public/posts?page=${page}&limit=${limit}&postType=post`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return fetchAPI<Post>(`/public/posts/${slug}`);
}

export async function getRelatedPosts(categoryIds: string[], currentPostId: string, limit = 3): Promise<Post[]> {
  if (categoryIds.length > 0) {
    try {
      const res = await fetchAPI<PostsResponse>(`/public/posts?categoryId=${categoryIds[0]}&limit=${limit + 1}&postType=post`);
      const filtered = res.data.filter(p => p.id !== currentPostId).slice(0, limit);
      if (filtered.length >= limit) return filtered;
    } catch {
      // Fall through to get any posts
    }
  }
  
  const res = await fetchAPI<PostsResponse>(`/public/posts?limit=${limit + 1}&postType=post`);
  return res.data.filter(p => p.id !== currentPostId).slice(0, limit);
}

export async function getCategories() {
  return fetchAPI<{ id: string; name: string; slug: string; description?: string; postCount?: number }[]>('/public/categories');
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug);
}

export async function getPostsByCategory(categoryId: string, page = 1, limit = 10): Promise<PostsResponse> {
  return fetchAPI<PostsResponse>(`/public/posts?categoryId=${categoryId}&page=${page}&limit=${limit}&postType=post`);
}

export function generateTOC(htmlContent: string): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];
  const headingRegex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    toc.push({ id, text, level });
  }
  
  return toc;
}

export function addHeadingIds(htmlContent: string): string {
  return htmlContent.replace(/<h([23])([^>]*)>([^<]+)<\/h([23])>/gi, (match, level, attrs, text, closeLevel) => {
    const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (attrs.includes('id=')) return match;
    return `<h${level}${attrs} id="${id}">${text}</h${closeLevel}>`;
  });
}

export type { Post, PostsResponse };
