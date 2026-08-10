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
  const { data: articles } = await fetchArticles();
  const mainLead = articles[0];
  const subLeads = articles.slice(1, 4);

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
          {mainLead && (
            <Link href={`/${lang}/news/${mainLead.slug}`} className="group">
              <div className="aspect-[21/9] bg-muted overflow-hidden relative border-b-4 border-primary">
                <img 
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop" 
                  alt="Main Lead Story" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded text-white max-w-4xl">
                  <span className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider mb-3 inline-block px-2 py-1">
                    {isEn ? mainLead.category.name_en : mainLead.category.name_np}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight group-hover:text-primary transition-colors text-balance">
                    {isEn ? mainLead.title_en : mainLead.title_np}
                  </h1>
                </div>
              </div>
            </Link>
          )}

          {/* Sub Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {subLeads.map((item, idx) => (
              <Link href={`/${lang}/news/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop&sig=${idx}`} 
                    alt="Sub Lead" 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                    {isEn ? item.title_en : item.title_np}
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <Link href={`/${lang}/news/latest-${i}`} key={i} className="py-3 group flex gap-4">
                    <span className="text-primary font-bold text-2xl opacity-50 w-6">{i}</span>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                      {isEn ? `Breaking news flash updating voters on election ${i}` : `निर्वाचनको बारेमा मतदाताहरूलाई अद्यावधिक गर्ने ब्रेकिंग न्यूज फ्ल्यास ${i}`}
                    </h3>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="border rounded-md p-4 mt-2 shadow-sm bg-card">
              <div className="flex flex-col divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Link href={`/${lang}/news/trending-${i}`} key={i} className="py-3 group flex gap-4">
                    <span className="text-destructive font-bold text-2xl opacity-50 w-6">{i}</span>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                      {isEn ? `Why everyone is talking about the new tech policy ${i}` : `नयाँ प्रविधि नीतिको बारेमा सबैले किन कुरा गरिरहेका छन् ${i}`}
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
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-none rounded-none group bg-transparent">
              <CardContent className="p-0">
                <Link href={`/${lang}/news/politics-${i}`}>
                  <div className="aspect-video bg-muted overflow-hidden mb-3">
                    <img 
                      src={`https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop&sig=${i}`} 
                      alt="Politics" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                    {isEn ? `Parliament session adjourned after intense debate over budget ${i}` : `बजेट ${i} माथिको गहन बहसपछि संसद बैठक स्थगित`}
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

      {/* Section: Opinion & Editorials (Light shaded background) */}
      <section className="mb-12 bg-muted/30 p-6 md:p-8 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-8 border-b-2 border-foreground pb-2">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight flex items-center gap-2">
            <span className="w-4 h-4 bg-foreground inline-block rounded-full"></span>
            {isEn ? 'Opinion & Editorials' : 'विचार र सम्पादकीय'}
          </h2>
          <Link href={`/${lang}/opinion`} className="text-sm font-semibold hover:underline">
            {isEn ? 'View All →' : 'सबै हेर्नुहोस् →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Link href={`/${lang}/news/opinion-${i}`} key={i} className="group flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-background shadow-md">
                <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="Author" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors mb-2">
                {isEn ? `Why the new economic policy might fail us all - Perspective ${i}` : `नयाँ आर्थिक नीति किन असफल हुन सक्छ - दृष्टिकोण ${i}`}
              </h3>
              <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                {isEn ? 'John Doe' : 'राम बहादुर'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Split Section: Business (2/3) & Technology (1/3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
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
            <Link href={`/${lang}/news/business-lead`} className="group col-span-1 sm:col-span-2 md:col-span-1">
              <div className="aspect-[4/3] bg-muted overflow-hidden mb-3">
                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop" alt="Business" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-2xl leading-snug group-hover:text-blue-600 transition-colors">
                {isEn ? 'Stock Market Reaches All Time High Following Q2 Earnings Reports' : 'दोस्रो त्रैमासिकको कमाई पछि सेयर बजारले कीर्तिमानी उचाइ चुम्यो'}
              </h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">
                {isEn ? 'Investors are optimistic as the central bank signals a pause in interest rate hikes, leading to a massive rally across all major sectors.' : 'केन्द्रीय बैंकले ब्याजदर वृद्धिलाई रोक्ने संकेत दिएकाले लगानीकर्ताहरू आशावादी छन्, जसले गर्दा सबै प्रमुख क्षेत्रहरूमा ठूलो र्याली भएको छ।'}
              </p>
            </Link>
            
            {/* Business Sub-items */}
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <Link href={`/${lang}/news/business-${i}`} key={i} className="group flex gap-4">
                  <div className="w-1/3 aspect-video bg-muted overflow-hidden flex-shrink-0">
                    <img src={`https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=400&auto=format&fit=crop&sig=${i}`} alt="Business Mini" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                    {isEn ? `Startup funding drops by 20% in the last quarter ${i}` : `पछिल्लो त्रैमासिकमा स्टार्टअप कोष २०% ले घट्यो ${i}`}
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
            <Link href={`/${lang}/news/tech-lead`} className="group border-b pb-6">
              <div className="aspect-video bg-muted overflow-hidden mb-3">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Tech" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-xl leading-snug group-hover:text-purple-600 transition-colors">
                {isEn ? 'New AI Regulations Proposed by Parliament to Curb Misinformation' : 'गलत जानकारी रोक्न संसदद्वारा नयाँ एआई नियमन प्रस्ताव'}
              </h3>
            </Link>

            {[1, 2].map((i) => (
              <Link href={`/${lang}/news/tech-${i}`} key={i} className="group flex gap-4">
                <div className="w-1/4 aspect-square bg-muted overflow-hidden flex-shrink-0">
                  <img src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop&sig=${i}`} alt="Tech Mini" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold leading-tight group-hover:text-purple-600 transition-colors line-clamp-3">
                  {isEn ? `Major smartphone manufacturer announces new flagship ${i}` : `प्रमुख स्मार्टफोन निर्माताले नयाँ फ्ल्यागशिप घोषणा गर्‍यो ${i}`}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Multimedia / Videos Section (Dark Theme Block) */}
      <section className="mb-12 bg-zinc-950 text-zinc-50 p-6 md:p-10 rounded-2xl">
        <div className="flex items-center justify-between mb-8 border-b-2 border-red-600 pb-2">
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-4 h-4 bg-red-600 inline-block rounded-full animate-pulse"></span>
            {isEn ? 'Multimedia & Video' : 'मल्टिमिडिया र भिडियो'}
          </h2>
          <Link href={`/${lang}/video`} className="text-sm font-semibold hover:text-red-500 transition-colors">
            {isEn ? 'Watch All →' : 'सबै हेर्नुहोस् →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Link href={`/${lang}/video/${i}`} key={i} className="group">
              <div className="aspect-video bg-zinc-800 overflow-hidden mb-4 relative rounded-lg">
                <img src={`https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop&sig=${i}`} alt="Video Thumbnail" className="object-cover w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center backdrop-blur-sm group-hover:bg-red-600 transition-colors shadow-xl">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                {isEn ? `Exclusive Interview: Finance Minister discussing the new fiscal policies ${i}` : `विशेष अन्तर्वार्ता: अर्थमन्त्री नयाँ आर्थिक नीतिको बारेमा छलफल गर्दै ${i}`}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Sports Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-2">
          <h2 className="text-3xl font-extrabold text-orange-500 uppercase tracking-tight flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 inline-block rounded-sm"></span>
            {isEn ? 'Sports' : 'खेलकुद'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href={`/${lang}/news/sports-lead`} className="group md:col-span-2">
            <div className="aspect-video bg-muted overflow-hidden mb-3">
              <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop" alt="Sports Lead" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-2xl leading-snug group-hover:text-orange-500 transition-colors">
              {isEn ? 'National Team Secures Historic Victory in the Final Match' : 'राष्ट्रिय टोलीले अन्तिम खेलमा ऐतिहासिक जित हासिल गर्यो'}
            </h3>
          </Link>
          
          {[1, 2].map((i) => (
            <Link href={`/${lang}/news/sports-${i}`} key={i} className="group flex flex-col gap-3 md:col-span-1">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop&sig=${i}`} alt="Sports Mini" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-bold leading-snug group-hover:text-orange-500 transition-colors line-clamp-3">
                {isEn ? `Local marathon sees record breaking participation this year ${i}` : `स्थानीय म्याराथनमा यस वर्ष कीर्तिमानी सहभागिता ${i}`}
              </h4>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
