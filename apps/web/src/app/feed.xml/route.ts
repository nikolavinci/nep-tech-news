export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>NepTechNews</title>
  <link>https://neptechnews.com</link>
  <description>Delivering high-quality digital journalism from the heart of Nepal to the world.</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://neptechnews.com/feed.xml" rel="self" type="application/rss+xml"/>
  
  <item>
    <title>The Future of AI in Modern Newsrooms: A Comprehensive Analysis</title>
    <link>https://neptechnews.com/en/news/the-future-of-ai-in-modern-newsrooms</link>
    <description>How artificial intelligence is reshaping digital journalism, automated fact-checking, and content distribution.</description>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <guid>https://neptechnews.com/en/news/the-future-of-ai-in-modern-newsrooms</guid>
  </item>
  
  <item>
    <title>Major Political Shift Announced Following Midnight Coalition Talks</title>
    <link>https://neptechnews.com/en/news/major-political-shift</link>
    <description>In a surprising turn of events, the ruling coalition has agreed to a massive reshuffle affecting key ministries ahead of the fiscal budget.</description>
    <pubDate>${new Date(Date.now() - 86400000).toUTCString()}</pubDate>
    <guid>https://neptechnews.com/en/news/major-political-shift</guid>
  </item>
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
