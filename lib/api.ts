import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = <T>(url: string): Promise<T> => fetch(url).then(res => res.json());

export function useCategories() {
  return useSWR<Category[]>(`${API_URL}/api/forum-categories`, fetcher<Category[]>);
}

export function useHashtags() {
  return useSWR<Hashtag[]>(`${API_URL}/api/forum-hashtags`, fetcher<Hashtag[]>);
}

export function usePopularHashtags() {
  return useSWR<Hashtag[]>(`${API_URL}/api/forum-hashtags/popular`, fetcher<Hashtag[]>);
}

export function usePosts() {
  return useSWR<Post[]>(`${API_URL}/api/forum-posts`, fetcher<Post[]>);
}

export function usePostComments(postId: number) {
  return useSWR<Comment[]>(postId ? `${API_URL}/api/forum-comments/posts/${postId}` : null, fetcher<Comment[]>);
}

export interface Category {
  id: number;
  name: string;
}

export interface Hashtag {
  id: number;
  name: string;
  usage_count?: number;
}

export interface User {
  name: string | null;
  username: string;
  picture: string | null;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  parent_comment_id: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  parent: {
    id: number;
    content: string;
  } | null;
  replies?: Comment[];
}

export interface Post {
  id: number;
  user_id: string;
  category_id: number;
  title: string;
  content: string;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
  total_reactions: number;
  likes_count: string;
  dislikes_count: string;
  total_comments: number;
  user: User;
  hashtags: Hashtag[];
}