export interface ForumCategory {
  id: number;
  name: string;
}

export interface ForumHashtag {
  id: number;
  name: string;
  usage_count?: number;
}

export interface ForumUser {
  id: string;
  username: string;
}

export interface ForumPost {
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
  user: {
    username: string;
    picture?: string;
  };
  hashtags: string[];
}

export interface ForumComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: number;
}

export type ReactionType = 'like' | 'dislike';