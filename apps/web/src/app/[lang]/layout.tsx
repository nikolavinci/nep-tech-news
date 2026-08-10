import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: "%s | NepTechNews",
    default: "NepTechNews | Bilingual Digital News",
  },
  description: "High-performance bilingual digital news platform covering the latest in technology, AI, startups, and innovation.",
  openGraph: {
    type: 'website',
    siteName: 'NepTechNews',
    images: ['/placeholder-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@neptechnews',
    creator: '@neptechnews',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isNepali = lang === 'np';
  const fontClass = isNepali ? notoDevanagari.className : inter.className;
  const fontVars = `${inter.variable} ${notoDevanagari.variable}`;

  return (
    <html
      lang={lang}
      className={`${fontClass} ${fontVars} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header lang={lang} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer lang={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
