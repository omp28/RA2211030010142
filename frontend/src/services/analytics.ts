import { TopUser, TopPost } from '../types';
import { fetchUsers, fetchUserPosts, fetchPostComments } from './api';

export const getTopUsers = async (limit: number = 5): Promise<TopUser[]> => {
  try {
    const users = await fetchUsers();
    const userPostCounts: TopUser[] = [];
    
    for (const user of users) {
      const posts = await fetchUserPosts(user.id);
      userPostCounts.push({
        userId: user.id,
        username: user.name,
        postCount: posts.length,
      });
    }
    
    return userPostCounts
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get top users:', error);
    throw error;
  }
};

export const getTopPosts = async (limit: number = 5): Promise<TopPost[]> => {
  try {
    const users = await fetchUsers();
    const allPosts: { postId: number; content: string; userId: number }[] = [];
    
    for (const user of users) {
      const posts = await fetchUserPosts(user.id);
      allPosts.push(...posts.map(post => ({
        postId: post.id,
        content: post.content,
        userId: parseInt(user.id),
      })));
    }
    
    const postsWithCommentCounts: TopPost[] = [];
    for (const post of allPosts) {
      const comments = await fetchPostComments(post.postId);
      postsWithCommentCounts.push({
        postId: post.postId,
        content: post.content,
        commentCount: comments.length,
      });
    }
    
    return postsWithCommentCounts
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get top posts:', error);
    throw error;
  }
};

export const getLatestPosts = async (limit: number = 5): Promise<TopPost[]> => {
  try {
    const users = await fetchUsers();
    const allPosts: { postId: number; content: string; userId: number }[] = [];
    
    for (const user of users) {
      const posts = await fetchUserPosts(user.id);
      allPosts.push(...posts.map(post => ({
        postId: post.id,
        content: post.content,
        userId: parseInt(user.id),
      })));
    }
    
    const latestPosts = allPosts
      .sort((a, b) => b.postId - a.postId)
      .slice(0, limit);
    
    const postsWithCommentCounts: TopPost[] = [];
    for (const post of latestPosts) {
      const comments = await fetchPostComments(post.postId);
      postsWithCommentCounts.push({
        postId: post.postId,
        content: post.content,
        commentCount: comments.length,
      });
    }
    
    return postsWithCommentCounts;
  } catch (error) {
    console.error('Failed to get latest posts:', error);
    throw error;
  }
};