import Parser from 'rss-parser';
import axios from 'axios';
import { config } from '../config/index.js';
import { newsService } from './newsService.js';
import { getCoordinates } from '../utils/geo.js';
import type { RSSSource, ParsedNews } from '../types/index.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'GlobeNews/1.0',
  },
});

export const rssService = {
  async fetchAllFeeds(): Promise<number> {
    // Ensure categories exist
    await newsService.ensureCategories();

    let totalFetched = 0;

    for (const source of config.rssSources) {
      try {
        const count = await this.fetchFeed(source);
        totalFetched += count;
      } catch (error) {
        console.error(`Failed to fetch ${source.name}:`, error);
      }
    }

    return totalFetched;
  },

  async fetchFeed(source: RSSSource): Promise<number> {
    console.log(`Fetching ${source.name}...`);

    const feed = await parser.parseURL(source.url);
    let count = 0;

    for (const item of feed.items || []) {
      if (count >= config.maxNewsPerFetch) break;

      try {
        const parsed = this.parseItem(item, source);
        if (parsed) {
          const coords = getCoordinates(parsed.country, parsed.city);

          await newsService.createNews({
            title: parsed.title,
            summary: parsed.summary,
            content: parsed.content,
            source: parsed.source,
            sourceUrl: parsed.sourceUrl,
            country: parsed.country,
            city: parsed.city,
            latitude: coords?.lat || null,
            longitude: coords?.lng || null,
            publishedAt: parsed.publishedAt,
            language: parsed.language,
            categoryId: (await newsService.getCategoryBySlug(parsed.categorySlug))?.id,
          });

          count++;
        }
      } catch (error) {
        console.error(`Failed to parse item:`, error);
      }
    }

    console.log(`Fetched ${count} items from ${source.name}`);
    return count;
  },

  parseItem(item: any, source: RSSSource): ParsedNews | null {
    if (!item.title) return null;

    const title = item.title.trim();
    const summary = item.contentSnippet || item.summary || item.content || null;
    const content = item.content || item.contentEncoded || null;
    const sourceUrl = item.link || item.guid || null;

    return {
      title,
      summary: summary ? summary.substring(0, 500) : null,
      content: content ? content.substring(0, 5000) : null,
      source: source.name,
      sourceUrl,
      publishedAt: item.pubDate || item.isoDate ? new Date(item.pubDate || item.isoDate) : null,
      country: source.country,
      city: source.city,
      language: source.language,
      categorySlug: source.category,
    };
  },

  // Fetch from RSSHub (if using local RSSHub instance)
  async fetchFromRSSHub(topic: string): Promise<any[]> {
    try {
      const url = `${config.rssHubUrl}/${topic}`;
      const response = await axios.get(url, { timeout: 10000 });
      const feed = await parser.parseString(response.data);
      return feed.items || [];
    } catch (error) {
      console.error(`Failed to fetch from RSSHub ${topic}:`, error);
      return [];
    }
  },
};
