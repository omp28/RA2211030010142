import axios from 'axios';
import { User, Post, Comment } from '../types';
import { users as localUsers } from '../data/users';
import { posts as localPosts } from '../data/posts';
import { comments as localComments } from '../data/comments';

const API_BASE_URL = process.env.API_BASE_URL;
const ENABLE_LOCAL_FALLBACK = process.env.ENABLE_LOCAL_FALLBACK === 'true';
const API_TIMEOUT = process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : 5000;
const USE_API = Boolean(API_BASE_URL);

let authToken: string | null = null;
let isApiAvailable = USE_API;

const cache = {
  users: new Map<string, User>(),
  posts: new Map<number, Post>(),
  comments: new Map<number, Comment[]>(),
  postsCountByUser: new Map<string, number>(),
  commentsCountByPost: new Map<number, number>(),
};

const initializeLocalData = () => {
  localUsers.forEach(user => 
    cache.users.set(user.id, user)
  );
  
  localPosts.forEach(post => {
    cache.posts.set(post.id, post);
    
    const userId = post.userId.toString();
    cache.postsCountByUser.set(
      userId,
      (cache.postsCountByUser.get(userId) || 0) + 1
    );
  });
  
  localPosts.forEach(post => {
    const postComments = localComments.filter(
      comment => comment.postId === post.id
    );
    
    cache.comments.set(post.id, postComments);
    cache.commentsCountByPost.set(post.id, postComments.length);
  });
};

initializeLocalData();

const api = USE_API
  ? axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
    })
  : null;

export const resetApiStatus = () => {
  isApiAvailable = USE_API;
};

const getHeaders = () => {
  if (!authToken) authToken = 'mock';
  return {
    Authorization: `Bearer ${authToken}`,
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  if (!USE_API || !api) {
    return [...cache.users.values()];
  }
  
  try {
    const response = await api.get(`/users`, {
      headers: getHeaders(),
    });
    
    const users = response.data.users.map(({ id, name }: { id: string, name: string }) => ({
      id: id,
      name: name,
    }));
    
    users.forEach((user: User) => 
      cache.users.set(user.id, user)
    );
    
    return users;
  } catch {
    isApiAvailable = false;
    if (ENABLE_LOCAL_FALLBACK) return [...cache.users.values()];
    throw new Error('Failed to fetch users');
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  if (!USE_API || !api) {
    return [...cache.posts.values()].filter(
      post => post.userId === parseInt(userId)
    );
  }
  
  try {
    const response = await api.get(`/users/${userId}/posts`, {
      headers: getHeaders(),
    });
    
    const posts = response.data.posts.map((post: any) => ({
      id: post.id,
      userId: parseInt(userId),
      content: post.content,
    }));
    
    posts.forEach((post: Post) => 
      cache.posts.set(post.id, post)
    );
    
    cache.postsCountByUser.set(userId, posts.length);
    
    return posts;
  } catch {
    isApiAvailable = false;
    if (ENABLE_LOCAL_FALLBACK) return [...cache.posts.values()].filter(
      post => post.userId === parseInt(userId)
    );
    throw new Error('Failed to fetch user posts');
  }
};

export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  if (!USE_API || !api) {
    return cache.comments.get(postId) || localComments.filter(
      comment => comment.postId === postId
    );
  }
  
  try {
    const response = await api.get(`/posts/${postId}/comments`, {
      headers: getHeaders(),
    });
    
    const comments = response.data.comments.map((comment: any) => ({
      id: comment.id,
      postId: postId,
      content: comment.content,
    }));
    
    cache.comments.set(postId, comments);
    cache.commentsCountByPost.set(postId, comments.length);
    
    return comments;
  } catch {
    isApiAvailable = false;
    if (ENABLE_LOCAL_FALLBACK) return cache.comments.get(postId) || localComments.filter(
      comment => comment.postId === postId
    );
    throw new Error('Failed to fetch post comments');
  }
};

export const checkApiAvailability = async (): Promise<boolean> => {
  if (!USE_API || !api) {
    isApiAvailable = false;
    return false;
  }
  
  try {
    await api.get('/health', {
      timeout: 2000,
    });
    
    isApiAvailable = true;
    return true;
  } catch {
    isApiAvailable = false;
    return false;
  }
};

export const useLocalData = () => {
  isApiAvailable = false;
};
