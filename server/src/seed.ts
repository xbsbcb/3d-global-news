import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = [
    { name: '金融', slug: 'finance', color: '#4ecdc4' },
    { name: '政治', slug: 'politics', color: '#ff6b6b' },
    { name: '科技', slug: 'technology', color: '#00d4ff' },
    { name: '财经', slug: 'business', color: '#ffe66d' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log('Categories seeded');

  // Create sample news
  const techCategory = await prisma.category.findUnique({ where: { slug: 'technology' } });
  const politicsCategory = await prisma.category.findUnique({ where: { slug: 'politics' } });
  const financeCategory = await prisma.category.findUnique({ where: { slug: 'finance' } });

  const sampleNews = [
    {
      title: 'OpenAI Announces GPT-5 with Revolutionary Capabilities',
      summary: 'OpenAI has unveiled GPT-5, featuring unprecedented reasoning abilities and multimodal understanding.',
      source: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      categoryId: techCategory?.id,
      country: 'USA',
      city: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      publishedAt: new Date(),
      language: 'en',
    },
    {
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders have agreed on ambitious new targets for carbon emissions reduction.',
      source: 'Reuters',
      sourceUrl: 'https://reuters.com',
      categoryId: politicsCategory?.id,
      country: 'United Kingdom',
      city: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      publishedAt: new Date(),
      language: 'en',
    },
    {
      title: 'Asian Markets Rally on Economic Optimism',
      summary: 'Stock markets across Asia saw significant gains as economic indicators point to recovery.',
      source: 'Bloomberg',
      sourceUrl: 'https://bloomberg.com',
      categoryId: financeCategory?.id,
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      publishedAt: new Date(),
      language: 'en',
    },
    {
      title: 'China Launches New Space Station Module',
      summary: 'Tiangong Space Station expands with new laboratory module for scientific experiments.',
      source: 'BBC News',
      sourceUrl: 'https://bbc.com',
      categoryId: politicsCategory?.id,
      country: 'China',
      city: 'Beijing',
      latitude: 39.9042,
      longitude: 116.4074,
      publishedAt: new Date(),
      language: 'en',
    },
    {
      title: 'European Tech Startups Raise Record Funding',
      summary: 'European technology startups have raised unprecedented levels of venture capital.',
      source: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      categoryId: techCategory?.id,
      country: 'Germany',
      city: 'Berlin',
      latitude: 52.52,
      longitude: 13.405,
      publishedAt: new Date(),
      language: 'en',
    },
  ];

  for (const news of sampleNews) {
    const titleHash = hashString(news.title);
    await prisma.news.upsert({
      where: {
        titleHash_source: {
          titleHash,
          source: news.source || '',
        },
      },
      update: {},
      create: {
        ...news,
        titleHash,
      },
    });
  }

  console.log('Sample news seeded');
  console.log('Database seeding completed');
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
