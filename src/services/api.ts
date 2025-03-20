import { User, Post, Comment } from '@/types';
import { users } from '../../data/users';
import { posts } from '../../data/posts'; 
import { comments } from '../../data/comments';

const cache = {
  users: new Map<string, User>(),
  posts: new Map<number, Post>(),
  comments: new Map<number, Comment[]>(),
  postsCountByUser: new Map<string, number>(),
  commentsCountByPost: new Map<number, number>(),
};

const initializeCache = () => {
  users.forEach(user => {
    cache.users.set(user.id, user);
  });
  
  posts.forEach(post => {
    cache.posts.set(post.id, post);
    
    const userId = post.userId.toString();
    const currentCount = cache.postsCountByUser.get(userId) || 0;
    cache.postsCountByUser.set(userId, currentCount + 1);
  });
  
  posts.forEach(post => {
    const postComments = comments.filter(comment => comment.postId === post.id);
    cache.comments.set(post.id, postComments);
    cache.commentsCountByPost.set(post.id, postComments.length);
  });
};

initializeCache();

export const fetchUsers = async (): Promise<User[]> => {
  return [...cache.users.values()];
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  const numericUserId = parseInt(userId);
  return [...cache.posts.values()].filter(post => post.userId === numericUserId);
};

export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  return cache.comments.get(postId) || [];
};
