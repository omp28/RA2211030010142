import express from 'express';
import { getLatestPosts } from '../services/analytics';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const latestPosts = await getLatestPosts(limit);
    
    return res.json({
      data: latestPosts,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in latest-posts API:', error);
    return res.status(500).json({ error: 'Failed to fetch latest posts' });
  }
});

export { router as latestPostsRouter };