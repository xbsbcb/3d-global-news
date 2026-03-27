export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://globenews:globenews123@localhost:5432/globenews',

  // RSS settings
  rssHubUrl: process.env.RSSHUB_URL || 'http://localhost:1200',
  updateInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
  maxNewsPerFetch: 100,

  // Default RSS sources
  rssSources: [
    {
      name: 'BBC News World',
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      category: 'politics',
      language: 'en',
      country: 'United Kingdom',
    },
    {
      name: 'Reuters World',
      url: 'https://www.reutersagency.com/feed/?best-topics=world-news&post_type=best',
      category: 'politics',
      language: 'en',
      country: 'USA',
    },
    {
      name: 'Al Jazeera',
      url: 'https://www.aljazeera.com/xml/rss/all.xml',
      category: 'politics',
      language: 'en',
      country: 'Qatar',
    },
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'technology',
      language: 'en',
      country: 'USA',
    },
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
      category: 'technology',
      language: 'en',
      country: 'USA',
    },
    {
      name: 'Wired',
      url: 'https://www.wired.com/feed/rss',
      category: 'technology',
      language: 'en',
      country: 'USA',
    },
    {
      name: 'BBC Business',
      url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
      category: 'business',
      language: 'en',
      country: 'United Kingdom',
    },
    {
      name: 'CNBC',
      url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      category: 'business',
      language: 'en',
      country: 'USA',
    },
    {
      name: 'Financial Times',
      url: 'https://www.ft.com/?format=rss',
      category: 'finance',
      language: 'en',
      country: 'United Kingdom',
    },
  ],
};
