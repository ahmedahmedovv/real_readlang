
export interface PracticeSentence {
  original: string;
  translation: string;
  context: string;
}

export interface FeedbackResponse {
  isCorrect: boolean;
  explanation: string;
  betterTranslation?: string;
}

export enum Tab {
  HOME = 'Home',
  LIBRARY = 'Library',
  WORD_LIST = 'Word List',
  PRACTICE = 'Practice',
  CHAT = 'Chat',
  READER = 'Reader'
}

export interface LanguageConfig {
  known: string;
  learning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface WordItem {
  id: string;
  term: string;
  translation: string;
  partOfSpeech: string;
  // New fields for CSV Import support
  context?: string;
  interval?: number;     // Practice Interval in days
  nextPractice?: string; // YYYY-MM-DD
}

export interface Story {
  id: string;
  title: string;
  level: string; // e.g. "A1", "A2"
  content: string;
  summary: string;
  coverColor: string;
}

export interface ChatSession {
  sendMessage(params: { message: string }): Promise<{ text: string }>;
}