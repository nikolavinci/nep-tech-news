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
