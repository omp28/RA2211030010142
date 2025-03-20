import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { topUsersRouter } from './routes/topUsers';
import { topPostsRouter } from './routes/topPosts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());


app.use('/users', topUsersRouter);
app.use('/posts', topPostsRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log(`- GET http://localhost:${port}/users?limit=5`);
  console.log(`- GET http://localhost:${port}/posts?type=popular`);
  console.log(`- GET http://localhost:${port}/posts?type=latest`);
});