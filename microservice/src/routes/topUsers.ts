import express from 'express';
import { getTopUsers } from '../services/analytics';

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

export { router as topUsersRouter };