import Link from 'next/link';
import { fetchArticles } from '@/lib/api';

export default async function AdminArticlesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // We can fetch articles (ensure cache is bypassed in admin for fresh data)
  // For now we'll use the existing fetchArticles
  const { data: articles } = await fetchArticles();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link 
          href={`/${lang}/admin/articles/create`} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:opacity-90"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Title (EN)</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground truncate max-w-xs" title={article.title_en}>
                      {article.title_en}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{article.category.name_en}</td>
                  <td className="px-6 py-4 text-muted-foreground">{article.author.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                      {article.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/${lang}/admin/articles/${article.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No articles found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
