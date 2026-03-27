import { Request, Response } from 'express';
import { newsService } from '../services/newsService.js';
import { rssService } from '../services/rssService.js';

export const newsController = {
  async getNews(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const category = req.query.category as string;
      const country = req.query.country as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const result = await newsService.getNews({
        page,
        limit,
        category,
        country,
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error getting news:', error);
      res.status(500).json({ success: false, error: 'Failed to get news' });
    }
  },

  async searchNews(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const q = req.query.q as string;

      if (!q) {
        res.status(400).json({ success: false, error: 'Search query is required' });
        return;
      }

      const result = await newsService.searchNews(q, { page, limit });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({ success: false, error: 'Failed to search news' });
    }
  },

  async getNewsById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const news = await newsService.getNewsById(id);

      if (!news) {
        res.status(404).json({ success: false, error: 'News not found' });
        return;
      }

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Error getting news by id:', error);
      res.status(500).json({ success: false, error: 'Failed to get news' });
    }
  },

  async triggerFetch(req: Request, res: Response) {
    try {
      const estimatedCount = await rssService.fetchAllFeeds();

      res.json({
        success: true,
        data: {
          message: 'Fetch triggered successfully',
          estimatedCount,
        },
      });
    } catch (error) {
      console.error('Error triggering fetch:', error);
      res.status(500).json({ success: false, error: 'Failed to trigger fetch' });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await newsService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ success: false, error: 'Failed to get categories' });
    }
  },
};
