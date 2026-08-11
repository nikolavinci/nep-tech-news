import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WebStories } from "@/components/home/WebStories";
import { fetchArticles } from '@/lib/api';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  // Fetch real articles from Laravel API
  const { data: articles } = await fetchArticles(1, 24); // Fetch more for the homepage
  
  // Safe fallbacks for sections
  const mainLead = articles[0];
  const subLeads = articles.slice(1, 4);
  const latestNews = articles.slice(0, 5);
  const trendingNews = articles.slice(4, 9);
  const politicsNews = articles.slice(5, 9);
  const opinionNews = articles.slice(9, 13);
  const businessLead = articles[13] || articles[0];
  const businessNews = articles.slice(14, 17);
  const techLead = articles[17] || articles[1];
  const techNews = articles.slice(18, 20);
  const videoNews = articles.slice(20, 23);
  const sportsLead = articles[23] || articles[2];
  const sportsNews = articles.slice(0, 2);

  const getImageUrl = (article: any, fallbackStr: string) => {
    if (!article || !article.featured_image) return fallbackStr;
    if (article.featured_image.startsWith('http')) return article.featured_image;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}`;
  };

  const getTitle = (article: any) => {
    if (!article) return isEn ? 'Loading article...' : 'लेख लोड हुँदैछ...';
    return isEn ? article.title_en : (article.title_np || article.title_en);
  };

  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-6">
      
      {/* Trending Topics Ribbon */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <span className="font-bold text-destructive flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          {isEn ? 'Trending:' : 'ट्रेन्डिङ:'}
        </span>
        {[1, 2, 3, 4, 5].map((topic) => (
          <Link href={`/${lang}/tag/topic-${topic}`} key={topic} className="px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
            {isEn ? `Budget 2026` : `बजेट २०८३`}
          </Link>
        ))}
      </div>

      {/* Top Ad Leaderboard */}
      <a href="https://nikolavinci.com" target="_blank" rel="noopener noreferrer" className="w-full h-24 sm:h-32 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-zinc-800 flex items-center justify-between px-8 mb-8 relative group overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop')] opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col justify-center">
          <span className="text-white font-extrabold text-xl sm:text-3xl leading-tight tracking-tight">Need a Custom Website?</span>
          <span className="text-zinc-400 text-sm sm:text-base font-medium">Elevate your brand with Nikola Vinci's premium web solutions.</span>
        </div>
        <div className="relative z-10 hidden sm:block">
          <span className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">Start Building</span>
        </div>
        <div className="absolute top-1 right-1 px-1 bg-black/50 text-[10px] text-zinc-500 uppercase rounded z-10">Ad</div>
      </a>

      {/* Main Orchestration Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
        
        {/* Left Side: Hero Section (75%) */}
        <section className="xl:col-span-9 flex flex-col gap-6">
          {/* Main Lead Story */}
          {mainLead ? (
            <Link href={`/${lang}/news/${mainLead.slug}`} className="group">
              <div className="aspect-[21/9] bg-muted overflow-hidden relative border-b-4 border-primary">
                <img 
                  src={getImageUrl(mainLead, "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop")} 
                  alt={getTitle(mainLead)} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded text-white max-w-4xl">
                  <span className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider mb-3 inline-block px-2 py-1">
                    {isEn ? mainLead.category?.name_en || 'News' : mainLead.category?.name_np || 'समाचार'}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight group-hover:text-primary transition-colors text-balance">
                    {getTitle(mainLead)}
                  </h1>
                </div>
              </div>
            </Link>
          ) : (
            <div className="aspect-[21/9] bg-muted border flex items-center justify-center">
              <p className="text-muted-foreground font-bold">No articles found. Please fetch news or create an article.</p>
            </div>
          )}

          {/* Sub Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {subLeads.map((item, idx) => (
              <Link href={`/${lang}/news/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img 
                    src={getImageUrl(item, `https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop&sig=${idx}`)} 
                    alt={getTitle(item)} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                    {getTitle(item)}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right Side: Sidebar (25%) */}
        <aside className="xl:col-span-3 flex flex-col gap-6">
          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="latest" className="font-bold">{isEn ? 'Latest' : 'ताजा अपडेट'}</TabsTrigger>
              <TabsTrigger value="trending" className="font-bold">{isEn ? 'Trending' : 'लोकप्रिय'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="border rounded-md p-4 mt-2 shadow-sm bg-card">
              <div className="flex flex-col divide-y">
                {latestNews.map((item, idx) => (
                  <Link href={`/${lang}/news/${item.slug}`} key={idx} className="py-3 group flex gap-4">
                    <span className="text-primary font-bold text-2xl opacity-50 w-6">{idx+1}</span>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(item)}
                    </h3>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="border rounded-md p-4 mt-2 shadow-sm bg-card">
              <div className="flex flex-col divide-y">
                {trendingNews.map((item, idx) => (
                  <Link href={`/${lang}/news/${item.slug}`} key={idx} className="py-3 group flex gap-4">
                    <span className="text-destructive font-bold text-2xl opacity-50 w-6">{idx+1}</span>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(item)}
                    </h3>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Sidebar Square Ad */}
          <a href="https://nikolavinci.com" target="_blank" rel="noopener noreferrer" className="w-full aspect-square bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-xl transition-all group overflow-hidden border border-zinc-800 mt-4 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop')] opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center mix-blend-overlay"></div>
            <span className="relative z-10 font-bold text-2xl mb-2 leading-tight">Build Your Dream Website</span>
            <span className="relative z-10 text-sm text-zinc-300 mb-6">Custom Website Creation by Nikola Vinci</span>
            <span className="relative z-10 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">Learn More</span>
            <span className="absolute top-2 right-2 px-1 bg-black/50 text-[10px] text-zinc-400 uppercase rounded">Ad</span>
          </a>
        </aside>

      </div>

      {/* Web Stories */}
      <WebStories lang={lang} />

      <Separator className="my-8 h-[2px] bg-primary/20" />

      {/* Category Section: Politics / National */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-2">
          <h2 className="text-3xl font-extrabold text-primary uppercase tracking-tight flex items-center gap-2">
            <span className="w-4 h-4 bg-primary inline-block rounded-sm"></span>
            {isEn ? 'National & Politics' : 'राष्ट्रिय तथा राजनीति'}
          </h2>
          <Link href={`/${lang}/politics`} className="text-sm font-semibold hover:underline bg-muted px-3 py-1 rounded">
            {isEn ? 'View All →' : 'सबै हेर्नुहोस् →'}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {politicsNews.map((item, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-none rounded-none group bg-transparent">
              <CardContent className="p-0">
                <Link href={item ? `/${lang}/news/${item.slug}` : '#'}>
                  <div className="aspect-video bg-muted overflow-hidden mb-3">
                    <img 
                      src={getImageUrl(item, `https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop&sig=${idx}`)} 
                      alt="Politics" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-3">
                    {getTitle(item)}
                  </h3>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Middle Ad Leaderboard */}
      <a href="https://nikolavinci.com" target="_blank" rel="noopener noreferrer" className="w-full h-24 sm:h-32 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-zinc-800 flex items-center justify-between px-8 mb-12 relative group overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop')] opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col justify-center">
          <span className="text-white font-extrabold text-xl sm:text-3xl leading-tight tracking-tight">Transform Your Digital Presence</span>
          <span className="text-zinc-400 text-sm sm:text-base font-medium">Nikola Vinci custom website solutions. Get a free consultation today.</span>
        </div>
        <div className="relative z-10 hidden sm:block">
          <span className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-sm group-hover:bg-primary group-hover:text-white transition-colors">Contact Us</span>
        </div>
        <div className="absolute top-1 right-1 px-1 bg-black/50 text-[10px] text-zinc-500 uppercase rounded z-10">Ad</div>
      </a>

      {/* Split Section: Business (2/3) & Technology (1/3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 mt-12">
        {/* Business */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6 border-b-2 border-blue-600 pb-2">
            <h2 className="text-3xl font-extrabold text-blue-600 uppercase tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-600 inline-block rounded-sm"></span>
              {isEn ? 'Business & Economy' : 'व्यापार र अर्थतन्त्र'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Business Lead */}
            {businessLead && (
              <Link href={`/${lang}/news/${businessLead.slug}`} className="group col-span-1 sm:col-span-2 md:col-span-1">
                <div className="aspect-[4/3] bg-muted overflow-hidden mb-3">
                  <img src={getImageUrl(businessLead, "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop")} alt="Business" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-2xl leading-snug group-hover:text-blue-600 transition-colors">
                  {getTitle(businessLead)}
                </h3>
                <p className="mt-2 text-muted-foreground line-clamp-2">
                  {isEn ? businessLead.body_en.replace(/<[^>]+>/g, '') : (businessLead.body_np?.replace(/<[^>]+>/g, '') || businessLead.body_en.replace(/<[^>]+>/g, ''))}
                </p>
              </Link>
            )}
            
            {/* Business Sub-items */}
            <div className="flex flex-col gap-6">
              {businessNews.map((item, idx) => (
                <Link href={item ? `/${lang}/news/${item.slug}` : '#'} key={idx} className="group flex gap-4">
                  <div className="w-1/3 aspect-video bg-muted overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(item, `https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=400&auto=format&fit=crop&sig=${idx}`)} alt="Business Mini" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                    {getTitle(item)}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-6 border-b-2 border-purple-600 pb-2">
            <h2 className="text-3xl font-extrabold text-purple-600 uppercase tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 bg-purple-600 inline-block rounded-sm"></span>
              {isEn ? 'Technology' : 'प्रविधि'}
            </h2>
          </div>
          
          <div className="flex flex-col gap-6">
            {techLead && (
              <Link href={`/${lang}/news/${techLead.slug}`} className="group border-b pb-6">
                <div className="aspect-video bg-muted overflow-hidden mb-3">
                  <img src={getImageUrl(techLead, "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop")} alt="Tech" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-xl leading-snug group-hover:text-purple-600 transition-colors">
                  {getTitle(techLead)}
                </h3>
              </Link>
            )}

            {techNews.map((item, idx) => (
              <Link href={item ? `/${lang}/news/${item.slug}` : '#'} key={idx} className="group flex gap-4">
                <div className="w-1/4 aspect-square bg-muted overflow-hidden flex-shrink-0">
                  <img src={getImageUrl(item, `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop&sig=${idx}`)} alt="Tech Mini" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold leading-tight group-hover:text-purple-600 transition-colors line-clamp-3">
                  {getTitle(item)}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
