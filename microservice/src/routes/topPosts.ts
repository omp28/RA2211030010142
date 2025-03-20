import express from 'express';
import { getTopPosts, getLatestPosts } from '../services/analytics';
import { fetchPostComments } from '../services/api';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string || '5');
    const type = req.query.type as string || 'popular';
    
    let posts;
    if (type === 'popular') {
      posts = await getTopPosts(limit);
    } else if (type === 'latest') {
      posts = await getLatestPosts(limit);
    } else {
      return res.status(400).json({ error: 'Invalid type parameter. Use "popular" or "latest".' });
    }
    
    return res.json({
      data: posts,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in posts API:', error);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


router.get('/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await fetchPostComments(postId);
    
    return res.json({
      comments: comments,
    });
  } catch (error) {
    console.error(`Error fetching comments for post ${req.params.postId}:`, error);
    return res.status(500).json({ error: 'Failed to fetch post comments' });
  }
});

export { router as topPostsRouter };