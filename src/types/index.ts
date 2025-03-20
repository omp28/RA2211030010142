export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
}

export interface TopUser {
  userId: string;
  username: string;
  postCount: number;
}

export interface TopPost {
  postId: number;
  content: string;
  commentCount: number;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: number;
}