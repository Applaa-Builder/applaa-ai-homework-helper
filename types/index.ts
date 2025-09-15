export interface Question {
  id: string;
  text: string;
  subject: string;
  timestamp: number;
  imageUri?: string;
  answered: boolean;
}

export interface Message {
  id: string;
  questionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string | Array<ContentPart>;
  timestamp: number;
}

export type ContentPart = 
  | { type: 'text'; text: string; }
  | { type: 'image'; image: string; }

export interface StudyPlan {
  id: string;
  date: string;
  completed: boolean;
  tasks: StudyTask[];
}

export interface StudyTask {
  id: string;
  subject: string;
  description: string;
  completed: boolean;
  duration: number; // in minutes
}

export interface UserProfile {
  name: string;
  age: number;
  grade: number;
  subjects: string[];
  points: number;
  streak: number;
  lastActive: string;
  badges: string[];
}