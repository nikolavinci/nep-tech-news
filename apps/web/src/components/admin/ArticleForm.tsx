'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NativeEditor } from './NativeEditor';
import { Category } from '@/lib/api';

interface ArticleFormProps {
  lang: string;
  accessToken: string;
  categories: Category[];
  initialData?: any;
}

export function ArticleForm({ lang, accessToken, categories, initialData }: ArticleFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'en'|'np'>('en');
  
  const [formData, setFormData] = useState({
    title_en: initialData?.title_en || '',
    title_np: initialData?.title_np || '',
    body_en: initialData?.body_en || '',
    body_np: initialData?.body_np || '',
    featured_image: initialData?.featured_image || '',
    category_id: initialData?.category_id || (categories.length > 0 ? categories[0].id : ''),
    status: initialData?.status || 'draft',
    published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: fd
      });

      if (!res.ok) throw new Error('Failed to upload image');
      
      const data = await res.json();
      setFormData({...formData, featured_image: data.media.file_path});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const isEdit = !!initialData;
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/articles/${initialData.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/articles`;
        
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 422 && errData.errors) {
            const errorMessages = Object.values(errData.errors).flat().join(', ');
            throw new Error(`Validation Error: ${errorMessages}`);
        }
        throw new Error(errData.message || 'Failed to save article');
      }

      router.push(`/${lang}/admin/articles`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md font-medium">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="flex border-b border-border">
            <button 
              type="button" 
              onClick={() => setActiveTab('en')} 
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              English Content
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('np')} 
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'np' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Nepali Content
            </button>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            {activeTab === 'en' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Headline (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title_en}
                    onChange={e => setFormData({...formData, title_en: e.target.value})}
                    className="w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter the English headline..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Article Body (English)</label>
                  <NativeEditor 
                    value={formData.body_en} 
                    onChange={val => setFormData({...formData, body_en: val})} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'np' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Headline (Nepali)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title_np}
                    onChange={e => setFormData({...formData, title_np: e.target.value})}
                    className="w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter the Nepali headline..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Article Body (Nepali)</label>
                  <NativeEditor 
                    value={formData.body_np} 
                    onChange={val => setFormData({...formData, body_np: val})} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background border rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2">Featured Image</h3>
            {formData.featured_image && (
              <div className="aspect-video w-full rounded overflow-hidden relative">
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${formData.featured_image}`} 
                  alt="Featured" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <span className="text-muted-foreground">{isUploading ? 'Uploading...' : (formData.featured_image ? 'Change Image' : 'Upload Image')}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2">Publishing Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                required
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Publish Date</label>
              <input 
                type="date"
                value={formData.published_at}
                onChange={e => setFormData({...formData, published_at: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  );
}
