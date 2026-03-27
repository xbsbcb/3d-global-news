import { prisma } from '../index.js';
import type { PaginatedResponse } from '../types/index.js';

interface GetNewsParams {
  page: number;
  limit: number;
  category?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

interface NewsWithCategory {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  sourceUrl: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  publishedAt: Date | null;
  language: string;
}

export const newsService = {
  async getNews(params: GetNewsParams): Promise<PaginatedResponse<NewsWithCategory>> {
    const { page, limit, category, country, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (category) {
      const categorySlugs = category.split(',');
      where.category = {
        slug: { in: categorySlugs },
      };
    }

    if (country) {
      where.country = country;
    }

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async searchNews(query: string, params: { page: number; limit: number }): Promise<PaginatedResponse<NewsWithCategory>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getNewsById(id: string): Promise<NewsWithCategory | null> {
    return prisma.news.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  async createNews(data: {
    title: string;
    summary?: string | null;
    content?: string | null;
    source?: string | null;
    sourceUrl?: string | null;
    categoryId?: string | null;
    country?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    publishedAt?: Date | null;
    language?: string;
  }) {
    // Check for duplicate by title hash
    const titleHash = hashString(data.title);
    const existing = await prisma.news.findFirst({
      where: {
        titleHash,
        source: data.source,
      },
    });

    if (existing) {
      return null; // Skip duplicate
    }

    return prisma.news.create({
      data: {
        ...data,
        titleHash,
      },
      include: {
        category: true,
      },
    });
  },

  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  async ensureCategories() {
    const defaultCategories = [
      { name: '金融', slug: 'finance', color: '#4ecdc4' },
      { name: '政治', slug: 'politics', color: '#ff6b6b' },
      { name: '科技', slug: 'technology', color: '#00d4ff' },
      { name: '财经', slug: 'business', color: '#ffe66d' },
    ];

    for (const cat of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }
  },
};

// Simple hash function for deduplication
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
