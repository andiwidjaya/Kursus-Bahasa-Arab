export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  created_at: string;
  bio?: string;
  target_goal?: string;
}

export type CourseLevel = 'PEMULA' | 'MENENGAH' | 'LANJUTAN';
export type CourseCategory = 'NAHWU' | 'SHOROF' | 'BACA_KITAB' | 'ALQURAN' | 'MUHADATSAH';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  thumbnail_url: string;
  level: CourseLevel;
  category: CourseCategory;
  price: number;
  discount_price?: number;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  rating: number;
  total_students: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  description: string;
  youtube_video_id: string;
  duration: string; // e.g. "12:35"
  order_index: number;
  is_preview: boolean;
  notes_markdown?: string;
  worksheet_filename?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'ACTIVE' | 'EXPIRED';
  enrolled_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at?: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'BCA_VA' | 'MANDIRI_VA' | 'BNI_VA' | 'QRIS' | 'GOPAY' | 'OVO' | 'CREDIT_CARD';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  course_id: string;
  course_title: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
  paid_at?: string;
}

export interface LearningPathLevel {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  course_ids: string[];
  icon: string;
}

// Additional PRD Features (§5, §31, §32, §35)
export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_arabic?: string;
  question_indo: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface VocabItem {
  id: string;
  course_id: string;
  arabic: string;
  transliteration: string;
  indo_meaning: string;
  category: string; // Ism, Fi'il, Harf
  example_sentence?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content_markdown: string;
  category: string;
  author: string;
  read_time: string;
  published_at: string;
  thumbnail_url: string;
}

export interface LessonComment {
  id: string;
  lesson_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  user_role: UserRole;
  text: string;
  created_at: string;
}

// AI & RAG Feature Types
export type KnowledgeSourceType = 'COURSE' | 'LESSON' | 'VOCAB' | 'BLOG' | 'GRAMMAR_RULE' | 'QUIZ';

export interface RAGContextItem {
  id: string;
  sourceType: KnowledgeSourceType;
  title: string;
  snippet: string;
  fullContent?: string;
  relevanceScore: number;
  routeLink: {
    route: 'course-detail' | 'learn' | 'vocab' | 'blog-detail';
    params?: {
      courseId?: string;
      lessonId?: string;
      blogSlug?: string;
    };
  };
  metadata?: {
    category?: string;
    level?: string;
    arabicText?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: RAGContextItem[];
  suggestedFollowups?: string[];
  isError?: boolean;
}

export interface AIChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  activeTopicFilter: 'ALL' | 'NAHWU_SHOROF' | 'VOCAB' | 'COURSES' | 'BLOG';
  customApiKey?: string;
}

