import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';

export const newsRouter = Router();

// GET /api/news - Get news list
newsRouter.get('/', newsController.getNews);

// GET /api/news/search - Search news
newsRouter.get('/search', newsController.searchNews);

// GET /api/news/:id - Get single news
newsRouter.get('/:id', newsController.getNewsById);

// POST /api/news/fetch - Trigger manual fetch
newsRouter.post('/fetch', newsController.triggerFetch);

// GET /api/categories - Get categories
newsRouter.get('/categories/all', newsController.getCategories);
