'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';

export function Header({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Basic language switcher logic
  const toggleLang = lang === 'en' ? 'np' : 'en';
  const newPath = pathname.replace(`/${lang}`, `/${toggleLang}`);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      {/* Top breaking news bar */}
      <div className="bg-destructive text-destructive-foreground text-xs py-1 px-4 flex justify-between items-center">
        <div>
          <span className="font-bold mr-2">{lang === 'en' ? 'BREAKING:' : 'ब्रेकिङ:'}</span>
          <span>{lang === 'en' ? 'Major update on the current top story goes here.' : 'मुख्य समाचारको ताजा अपडेट यहाँ आउनेछ।'}</span>
        </div>
        <div className="hidden sm:block" suppressHydrationWarning>
          {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ne-NP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-6">
          <Link href={`/${lang}`} className="text-2xl font-bold tracking-tighter text-primary" aria-label="NepTechNews Home">
            NepTechNews
          </Link>
          <nav className="hidden md:flex gap-4 text-sm font-medium" aria-label="Main Navigation">
            <Link href={`/${lang}/news`} className="hover:text-primary transition-colors">{lang === 'en' ? 'News' : 'समाचार'}</Link>
            <Link href={`/${lang}/politics`} className="hover:text-primary transition-colors">{lang === 'en' ? 'Politics' : 'राजनीति'}</Link>
            <Link href={`/${lang}/business`} className="hover:text-primary transition-colors">{lang === 'en' ? 'Business' : 'व्यापार'}</Link>
            <Link href={`/${lang}/technology`} className="hover:text-primary transition-colors">{lang === 'en' ? 'Tech' : 'प्रविधि'}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href={newPath} className="text-sm font-semibold border px-2 py-1 rounded hover:bg-muted transition-colors" aria-label={lang === 'en' ? 'Switch to Nepali' : 'Switch to English'}>
            {lang === 'en' ? 'नेपाली' : 'English'}
          </Link>
          
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 border rounded hover:bg-muted transition-colors" 
            aria-label={isSearchOpen ? "Close Search" : "Open Search"}
            aria-expanded={isSearchOpen}
          >
            {isSearchOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            )}
          </button>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full right-0 mt-2 p-4 bg-background border rounded-lg shadow-xl z-50 w-full sm:w-96 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="search" 
                placeholder={lang === 'en' ? 'Search news, authors...' : 'समाचार खोज्नुहोस्...'} 
                className="flex-1 px-3 py-2 bg-muted border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search Input"
              />
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md" aria-label="Submit Search">
                {lang === 'en' ? 'Search' : 'खोज'}
              </button>
            </form>
          </div>
        )}

      </div>
    </header>
  );
}
