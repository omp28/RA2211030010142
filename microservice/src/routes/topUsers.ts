import express from 'express';
import { getTopUsers } from '../services/analytics';
import { fetchUserPosts } from '../services/api';

const router = express.Router();

router.get('/', async (req, res) =>
{
  try {
    const limit = parseInt(req.query.limit as string || '5');
    const topUsers = await getTopUsers(limit);
    
    return res.json({
      data: topUsers,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in top-users API:', error);
    return res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

router.get('/:userId/posts', async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await fetchUserPosts(userId);
    
    return res.json({
      posts: posts,
    });
  } catch (error) {
    console.error(`Error fetching posts for user ${req.params.userId}:`, error);
    return res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

export { router as topUsersRouter };