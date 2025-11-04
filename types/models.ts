/**
 * Type definitions for backend models
 * These types match the Sequelize models in the backend
 */

export interface SubChapter {
  id: string;
  name: string;
  sub_chapter_number?: string;
  description?: string;
  chapter_id: string;
  sub_chapter_text?: string; // Virtual field that returns name
  questionCount?: number; // Added by backend queries
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Chapter {
  id: string;
  name: string;
  chapter_number?: string;
  description?: string;
  topic_id: string;
  chapter_text?: string; // Virtual field that returns name
  subChapters?: SubChapter[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Topic {
  id: string;
  topic_name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
