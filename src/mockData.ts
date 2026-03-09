
import { UserRole, AppState, ContentStatus } from './types';

export const MOCK_STATE: AppState = {
  user: {
    id: 'user-1',
    username: 'Ramanathan',
    email: 'student@demo.com',
    role: UserRole.STUDENT,
    language: 'Tamil',
    instituteId: 'inst-1',
    selectedClassId: 'class-9',
    streak: 5,
    lastActivityTimestamp: Date.now(),
    status: 'Active',
  },
  institute: {
    id: 'inst-1',
    name: 'Tamil Nadu Government School',
    location: 'Chennai',
    type: 'Government',
  },
  classes: [
    { id: 'class-9', name: 'Class 9', instituteId: 'inst-1' },
    { id: 'class-10', name: 'Class 10', instituteId: 'inst-1' },
  ],
  subjects: [
    { 
      id: 'subj-math', 
      name: 'Mathematics', 
      classId: 'class-9', 
      image: 'https://image2url.com/r2/default/images/1772465211647-6f6cfc85-19b7-4c7a-b4cc-002115110607.jpeg',
      color: 'from-blue-50 to-white'
    },
    { 
      id: 'subj-sci', 
      name: 'Science', 
      classId: 'class-9', 
      image: 'https://image2url.com/r2/default/images/1772465272456-b35e32af-a17a-4443-ac6d-c636bf4525b0.jpeg',
      color: 'from-blue-50 to-white'
    },
    { 
      id: 'subj-tam', 
      name: 'Tamil', 
      classId: 'class-9', 
      image: 'https://image2url.com/r2/default/images/1772465324035-b96d7663-6853-4ea9-aef0-dc5689c7ec72.jpeg',
      color: 'from-blue-50 to-white'
    },
    { 
      id: 'subj-eng', 
      name: 'English', 
      classId: 'class-9', 
      image: 'https://image2url.com/r2/default/images/1772465249026-ebd63f60-0864-420b-822a-c1df65f95025.jpeg',
      color: 'from-blue-50 to-white'
    },
    { 
      id: 'subj-ss', 
      name: 'Social Science', 
      classId: 'class-9', 
      image: 'https://image2url.com/r2/default/images/1772465301227-2f757c22-504e-4b10-8ad7-30e2ae17c4dd.jpeg',
      color: 'from-blue-50 to-white'
    }
  ],
  units: [
    { id: 'unit-math-1', name: 'Set Language', subjectId: 'subj-math', order: 1 },
    { id: 'unit-math-2', name: 'Real Numbers', subjectId: 'subj-math', order: 2 },
    { id: 'unit-math-3', name: 'Algebra', subjectId: 'subj-math', order: 3 },
    { id: 'unit-math-4', name: 'Geometry', subjectId: 'subj-math', order: 4 },
  ],
  microLessons: [
    { id: 'lesson-math-1-1', title: 'Introduction to Sets', unitId: 'unit-math-1', order: 1, duration: '15 mins' },
    { id: 'lesson-math-1-2', title: 'Types of Sets', unitId: 'unit-math-1', order: 2, duration: '20 mins' },
    { id: 'lesson-math-3-1', title: 'Polynomials', unitId: 'unit-math-3', order: 1, duration: '25 mins' },
  ],
  contents: [
    { 
      id: 'content-1', 
      title: 'Algebra Basics', 
      type: 'note', 
      status: ContentStatus.PUBLISHED, 
      subjectId: 'subj-math', 
      unitId: 'unit-math-3', 
      uploadedBy: 'user-1', 
      createdAt: Date.now() 
    }
  ],
  quizzes: [
    {
      id: 'quiz-1',
      lessonId: 'lesson-math-1-1',
      questions: [
        {
          id: 'q-1',
          text: 'What is a set?',
          options: ['A collection of well-defined objects', 'A list of numbers', 'A group of people', 'None of the above'],
          correctOptionIndex: 0,
          explanation: 'A set is a collection of well-defined objects.'
        }
      ]
    }
  ],
  progress: [
    { userId: 'user-1', lessonId: 'lesson-math-1-1', status: 'Completed', lastAccessed: Date.now(), quizScore: 100 }
  ]
};
