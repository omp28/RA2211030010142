import { User, Post, Comment } from '../types';
import { users as localUsers } from '../data/users';
import { posts as localPosts } from '../data/posts';
import { comments as localComments } from '../data/comments';

export const fetchUsers = async (): Promise<User[]> => {
  return localUsers;
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  const numericUserId = parseInt(userId);
  return localPosts.filter(post => post.userId === numericUserId);
};

export const fetchPostComments = async (postId: number): Promise<Comment[]> => {
  return localComments.filter(comment => comment.postId === postId);
};