
export enum UserRole {
  STUDENT = 'Student',
  SUBJECT_STAFF = 'Subject Teacher',
  CLASS_COORDINATOR = 'Class Teacher',
  PRINCIPAL = 'Principal',
}

export enum ContentStatus {
  UPLOADING = 'Uploading',
  PROCESSING = 'Processing',
  AI_SUGGESTED = 'AI Suggested',
  PUBLISHED = 'Published',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  language: string;
  instituteId?: string;
  selectedClassId?: string;
  assignedSubjectIds?: string[];
  assignedClassIds?: string[];
  streak: number;
  lastActivityTimestamp: number;
  status: 'Active' | 'Pending';
  avatar?: string;
}

export interface Institute {
  id: string;
  name: string;
  location: string;
  type: string;
}

export interface Class {
  id: string;
  name: string; // e.g., "Class 9"
  section?: string;
  instituteId: string;
}

export interface Subject {
  id: string;
  name: string;
  classId: string;
  image?: string;
  color?: string;
}

export interface Unit {
  id: string;
  name: string;
  subjectId: string;
  order: number;
}

export interface MicroLesson {
  id: string;
  title: string;
  unitId: string;
  order: number;
  duration?: string;
  isCompleted?: boolean;
}

export interface Content {
  id: string;
  title: string;
  type: 'note' | 'video' | 'document';
  status: ContentStatus;
  url?: string;
  subjectId?: string;
  unitId?: string;
  lessonId?: string;
  uploadedBy: string;
  createdAt: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Progress {
  userId: string;
  lessonId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastAccessed: number;
  quizScore?: number;
}

export interface AppState {
  user: User | null;
  institute: Institute | null;
  classes: Class[];
  subjects: Subject[];
  units: Unit[];
  microLessons: MicroLesson[];
  contents: Content[];
  quizzes: Quiz[];
  progress: Progress[];
}
