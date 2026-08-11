const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface Category {
  id: number;
  slug: string;
  name_en: string;
  name_np: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Article {
  id: number;
  slug: string;
  title_en: string;
  title_np: string;
  body_en: string;
  body_np: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  featured_image?: string | null;
  category_id?: number;
  author_id?: number;
  category: Category;
  author: Author;
}

export interface PaginatedArticles {
  data: Article[];
  current_page: number;
  last_page: number;
  total: number;
}

export async function fetchArticles(page: number = 1, limit: number = 12, q?: string): Promise<PaginatedArticles> {
  try {
    let url = `${API_BASE_URL}/articles?page=${page}&limit=${limit}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    
    const res = await fetch(url, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: [], current_page: 1, last_page: 1, total: 0 };
  }
}

export async function updateCategory(id: number, data: { slug?: string; name_en?: string; name_np?: string }) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

// --- RSS Feeds API ---
export interface RssFeed {
  id: number;
  name: string;
  url: string;
  lang: string;
  category_id: number;
  is_active: boolean;
  category?: Category;
}

export async function fetchRssFeeds(): Promise<RssFeed[]> {
  const res = await fetch(`${API_BASE_URL}/rss-feeds`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Failed to fetch RSS feeds');
  return res.json();
}

export async function createRssFeed(data: Partial<RssFeed>) {
  const res = await fetch(`${API_BASE_URL}/rss-feeds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create RSS feed');
  return res.json();
}

export async function updateRssFeed(id: number, data: Partial<RssFeed>) {
  const res = await fetch(`${API_BASE_URL}/rss-feeds/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update RSS feed');
  return res.json();
}

export async function deleteRssFeed(id: number) {
  const res = await fetch(`${API_BASE_URL}/rss-feeds/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete RSS feed');
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch article');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
