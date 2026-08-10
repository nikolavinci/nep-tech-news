import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchArticle } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const isEn = lang === 'en';
  const article = await fetchArticle(slug);

  if (!article) return {};

  const title = isEn ? article.title_en : (article.title_np || article.title_en);
  
  // Create a plain text description by stripping HTML from the body and taking first 160 chars
  const bodyText = isEn ? article.body_en : (article.body_np || article.body_en);
  const plainText = bodyText.replace(/<[^>]+>/g, '');
  const description = plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;

  const featuredImage = article.featured_image 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}` 
    : '/placeholder-og.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      authors: [article.author?.name || 'NepTechNews Editor'],
      images: [featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [featuredImage],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const isEn = lang === 'en';

  const article = await fetchArticle(slug);
  if (!article) notFound();

  const featuredImage = article.featured_image 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}` 
    : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: isEn ? article.title_en : (article.title_np || article.title_en),
    image: [featuredImage],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'NepTechNews Editor',
      url: `https://neptechnews.com/${lang}/author/${article.author_id}`
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Article Content */}
        <article className="lg:col-span-8">
      {/* Article Header */}
      <header className="mb-8 border-b pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href={`/${lang}/technology`} className="text-primary font-bold text-sm uppercase hover:underline">
            {isEn ? 'Technology' : 'प्रविधि'}
          </Link>
          <span className="text-muted-foreground text-sm">•</span>
          <time className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString(isEn ? 'en-US' : 'ne-NP', { 
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {isEn 
            ? 'The Future of AI in Modern Newsrooms: A Comprehensive Analysis' 
            : 'आधुनिक न्युजरुमहरूमा एआईको भविष्य: एक व्यापक विश्लेषण'}
        </h1>

        <Link href={`/${lang}/author/anil-bhattarai`} className="flex items-center gap-4 pt-4 border-t border-dashed hover:opacity-80 transition-opacity group">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-transparent group-hover:border-primary transition-colors">
            <img src="https://i.pravatar.cc/150?u=anil-bhattarai" alt="Anil Bhattarai" className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
              {isEn ? 'Anil Bhattarai' : 'अनिल भट्टराई'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEn ? 'Chief Editor' : 'प्रधान सम्पादक'}
            </p>
          </div>
        </Link>
      </header>

      {/* Featured Image */}
      <figure className="mb-12">
        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
            alt="Featured Image" 
            className="object-cover w-full h-full"
          />
        </div>
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {isEn 
            ? 'Illustration of AI algorithms processing digital news data.' 
            : 'डिजिटल समाचार डाटा प्रशोधन गर्ने एआई एल्गोरिदमको चित्रण।'}
        </figcaption>
      </figure>

      {/* Article Body */}
      <article className="prose dark:prose-invert max-w-none">
        {article.featured_image && (
          <div className="my-8 aspect-video w-full overflow-hidden rounded-xl">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}`} 
              alt={isEn ? article.title_en : article.title_np || article.title_en}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div 
          dangerouslySetInnerHTML={{ __html: isEn ? article.body_en : article.body_np || article.body_en }}
        />
      </article>

        {/* Author Bio Box */}
        <div className="my-12 p-6 md:p-8 bg-muted/30 border rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Link href={`/${lang}/author/anil-bhattarai`} className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors flex-shrink-0">
            <img src="https://i.pravatar.cc/150?u=anil-bhattarai" alt="Anil Bhattarai" className="object-cover w-full h-full" />
          </Link>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
              <Link href={`/${lang}/author/anil-bhattarai`} className="text-xl font-bold hover:text-primary transition-colors">
                {isEn ? 'Anil Bhattarai' : 'अनिल भट्टराई'}
              </Link>
              <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">{isEn ? 'Chief Editor' : 'प्रधान सम्पादक'}</span>
            </div>
            <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed">
              {isEn 
                ? 'Anil Bhattarai is an award-winning journalist specializing in technology and digital economy. He has covered major shifts in policy, startup ecosystems, and enterprise tech across Nepal for over a decade.'
                : 'अनिल भट्टराई प्रविधि र डिजिटल अर्थतन्त्रमा विशेषज्ञता हासिल गरेका एक पुरस्कार विजेता पत्रकार हुन्। उनले एक दशकभन्दा बढी समयदेखि नेपालभर नीति, स्टार्टअप इकोसिस्टम र इन्टरप्राइज टेकमा प्रमुख परिवर्तनहरू कभर गरेका छन्।'}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a href="#" aria-label="Author Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" aria-label="Author LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>

      {/* Related Stories */}
      <footer className="border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">
          {isEn ? 'Related Stories' : 'सम्बन्धित समाचारहरू'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Link href={`/${lang}/news/related-story-${i}`} key={i} className="flex gap-4 group border p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                <img 
                  src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                  alt="Related Story" 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3 mb-2">
                  {isEn 
                    ? `How machine learning algorithms are optimizing ad revenue in media part ${i}` 
                    : `कसरी मेसिन लर्निङ एल्गोरिदमहरूले मिडियामा विज्ञापन राजस्व अनुकूलन गर्दैछन् भाग ${i}`}
                </h4>
                <time className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </footer>
    </article>

      {/* Right Sidebar */}
      <aside className="lg:col-span-4 space-y-8">
        
        {/* Sidebar Ad */}
        <a href="https://nikolavinci.com" target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-xl transition-all group overflow-hidden border border-zinc-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop')] opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center mix-blend-overlay"></div>
          <span className="relative z-10 font-bold text-xl md:text-2xl mb-2 leading-tight">Build Your Dream Website</span>
          <span className="relative z-10 text-sm text-zinc-300 mb-6">Custom Website Creation by Nikola Vinci</span>
          <span className="relative z-10 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">Learn More</span>
          <span className="absolute top-2 right-2 px-1 bg-black/50 text-[10px] text-zinc-400 uppercase rounded">Ad</span>
        </a>

        {/* Trending Widget */}
        <div className="bg-muted/30 p-6 rounded-xl border">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
            <span className="w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
            {isEn ? 'Trending Now' : 'अहिले ट्रेन्डिङ'}
          </h3>
          <ul className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <Link href={`/${lang}/news/trending-${i}`} className="group flex gap-4 items-start">
                  <span className="text-4xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                    {i}
                  </span>
                  <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">
                    {isEn ? `Why the new tech infrastructure is essential for digital growth ${i}` : `डिजिटल वृद्धिको लागि नयाँ प्राविधिक पूर्वाधार किन आवश्यक छ ${i}`}
                  </h4>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent News Widget */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b-2 border-foreground pb-2">
            {isEn ? 'Recent News' : 'भर्खरै'}
          </h3>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Link href={`/${lang}/news/recent-${i}`} key={i} className="group flex gap-4">
                <div className="w-24 aspect-[4/3] bg-muted rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop&sig=${i+300}`} 
                    alt="Recent thumbnail" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                  />
                </div>
                <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                  {isEn ? `The latest updates on the national economy and markets ${i}` : `राष्ट्रिय अर्थतन्त्र र बजारहरूको पछिल्लो अपडेट ${i}`}
                </h4>
              </Link>
            ))}
          </div>
        </div>

      </aside>

      </div>
    </div>
  );
}
