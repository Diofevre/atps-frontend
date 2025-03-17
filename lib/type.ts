export interface SubItem {
  text: string;
  font_size: number;
  color: number;
  angle: number;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  username: string;
  picture: string;
  country: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  text: string;
  bbox: number[];
  type: 'title' | 'subtitle' | 'paragraph' | 'figure_title';
  sub_items: SubItem[];
}

export interface ImageItem {
  image_filename: string;
  position: number;
  width: number;
  height: number;
}

export interface LessonPage {
  lesson_id: string;
  total_page: number;
  fin_page: number;
  debut_page: number;
  page_number: number;
  contents: ContentItem[];
  images: ImageItem[];
  titles: {
    text: string;
    font_size: number;
    color: number;
    position: number[];
  }[];
}

export interface Topic {
  id: number;
  topic_name: string;
  exam_number_question: number;
  exam_duration: string | null;
  created_at: string | null;
  updated_at: string | null;
  type: 'exam' | 'lesson';
}

export interface TopicFormData {
  topic_name: string;
  exam_number_question: number;
  exam_duration: string;
  type: 'exam' | 'lesson';
}

export interface Chapter {
  id: number;
  chapter_text: string;
  topic_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ChapterFormData {
  chapter_text: string;
  topic_id: number;
}

export interface SubChapter {
  id: number;
  sub_chapter_text: string;
  chapter_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface SubChapterFormData {
  sub_chapter_text: string;
  chapter_id: number;
}

export interface QuestionOptions {
  [key: string]: string;
}

export interface Question {
  id: number;
  question_text: string;
  answer: string;
  options: QuestionOptions;
  explanation: string;
  countries: string[];
  explanation_images: string[];
  question_images: string[];
  quality_score: string;
  sub_chapter_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface QuestionFormData {
  question_text: string;
  answer: string;
  options: QuestionOptions;
  explanation: string;
  countries: string[];
  explanation_images: string[];
  question_images: string[];
  quality_score: string;
  sub_chapter_id: number;
}