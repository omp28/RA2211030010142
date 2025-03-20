import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { topUsersRouter } from './routes/topUsers';
import { topPostsRouter } from './routes/topPosts';
import { latestPostsRouter } from './routes/latestPosts'; 

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', topUsersRouter);
app.use('/posts', topPostsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log(`- GET http://localhost:${port}/users?limit=5`);
  console.log(`- GET http://localhost:${port}/posts?type=popular`);
  console.log(`- GET http://localhost:${port}/posts?type=latest`);
});