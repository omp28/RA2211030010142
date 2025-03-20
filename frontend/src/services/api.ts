import axios from 'axios';
import {User, Post, Comment} from '@/types';
import { users as localUsers } from '../../data/users';
import { posts as localPosts} from '../../data/posts'; 
import { comments as localComments } from '../../data/comments';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://20.244.56.144/test';
const ENABLE_LOCAL_FALLBACK = process.env.NEXT_PUBLIC_ENABLE_LOCAL_FALLBACK === 'true';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '5000');

let authToken: string | null = null;
let isApiAvailable = true; 

const cache = {
  users: new Map<string, User>(),
  posts: new Map<number, Post>(),
  comments: new Map<number, Comment[]>(),
  postsCountByUser: new Map<string, number>(),
  commentsCountByPost: new Map<number, number>(),
};

const initializeLocalData = () => {
  localUsers.forEach(user => {
    cache.users.set(user.id, user);
  });
  
  localPosts.forEach(post => {
    cache.posts.set(post.id, post);
    
    const userId = post.userId.toString();
    const currentCount = cache.postsCountByUser.get(userId) || 0;
    cache.postsCountByUser.set(userId, currentCount + 1);
  });
  
  localPosts.forEach(post => {
    const postComments = localComments.filter(comment => comment.postId === post.id);
    cache.comments.set(post.id, postComments);
    cache.commentsCountByPost.set(post.id, postComments.length);
  });
};

initializeLocalData();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
});

export const resetApiStatus = () => {
  isApiAvailable = true;
};

const getHeaders = () => {
  if (!authToken) {
    authToken = 'mock-token-for-local-development';
  }
  
  return {
    Authorization: `Bearer ${authToken}`,
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  if (!isApiAvailable && ENABLE_LOCAL_FALLBACK) {
    console.log('Using local user data');
    return [...cache.users.values()];
  }

  try {
    const response = await api.get(`/users`, { headers: getHeaders() });
    const users = Object.entries(response.data.users).map(([id, name]) => ({
      id,
      name: name as string,
    }));
    
    users.forEach(user => {
      cache.users.set(user.id, user);
    });
    
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    
    isApiAvailable = false;
    
    if (ENABLE_LOCAL_FALLBACK) {
      console.warn('Falling back to local user data');
      return [...cache.users.values()];
    }
    
    throw error;
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  if (!isApiAvailable && ENABLE_LOCAL_FALLBACK) {
    console.log(`Using local posts data for user ${userId}`);
    const numericUserId = parseInt(userId);
    return [...cache.posts.values()].filter(post => post.userId === numericUserId);
  }

  try {
    const response = await api.get(`/users/${userId}/posts`, { headers: getHeaders() });
    const posts = response.data.posts.map((post: any) => ({
      id: post.id,
      userId: parseInt(userId),
      content: post.content,
    }));
    
    posts.forEach((post: Post) => {
      cache.posts.set(post.id, post);
    });
    
    cache.postsCountByUser.set(userId, posts.length);
    
    return posts;
  } catch (error) {
    console.error(`Failed to fetch posts for user ${userId}:`, error);
    
    isApiAvailable = false;
    
    if (ENABLE_LOCAL_FALLBACK) {
      console.warn(`Falling back to local posts data for user ${userId}`);
      const numericUserId = parseInt(userId);
      return [...cache.posts.values()].filter(post => post.userId === numericUserId);
    }
    
    throw error;
  }
};

export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  if (!isApiAvailable && ENABLE_LOCAL_FALLBACK) {
    console.log(`Using local comments data for post ${postId}`);
    return cache.comments.get(postId) || [];
  }

  try {
    const response = await api.get(`/posts/${postId}/comments`, { headers: getHeaders() });
    const comments = response.data.comments.map((comment: any) => ({
      id: comment.id,
      postId,
      content: comment.content,
    }));
    
    cache.comments.set(postId, comments);
    cache.commentsCountByPost.set(postId, comments.length);
    
    return comments;
  } catch (error) {
    console.error(`Failed to fetch comments for post ${postId}:`, error);
    
    isApiAvailable = false;
    
    if (ENABLE_LOCAL_FALLBACK) {
      console.warn(`Falling back to local comments data for post ${postId}`);
      return cache.comments.get(postId) || [];
    }
    
    throw error;
  }
};

export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    await api.get(`${API_BASE_URL}/health`, { timeout: API_TIMEOUT });
    isApiAvailable = true;
    return true;
  } catch (error) {
    console.warn('API health check failed, will use local data');
    isApiAvailable = false;
    return false;
  }
};

export const useLocalData = () => {
  isApiAvailable = false;
};