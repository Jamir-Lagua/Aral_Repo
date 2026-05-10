/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TaskCategory {
  STUDY = 'Study',
  ASSIGNMENT = 'Assignment',
  PROJECT = 'Project',
  EXAM = 'Exam',
  OTHER = 'Other'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
  completed: boolean;
  userId: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  ANALYTICAL = 'analytical'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // Optional for analytical
  correctAnswer: number | string; // index for MC, model answer for analytical
  explanation?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  noteId: string;
}

export interface StudySession {
  id: string;
  userId: string;
  duration: number; // minutes
  timestamp: number;
}

export interface ResourceSuggestion {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book';
  description: string;
}

export interface Quiz {
  id: string;
  noteId: string;
  title: string;
  questions: Question[];
  userId: string;
  createdAt: number;
}

export interface StudyProgress {
  userId: string;
  tasksCompleted: number;
  totalNotes: number;
  quizzesTaken: number;
  averageScore: number;
  lastStudyDate: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown or Rich Text
  duration: string;
  isCompleted: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  description: string;
  modules: Module[];
  totalLessons: number;
  progress: number; // percentage
}
