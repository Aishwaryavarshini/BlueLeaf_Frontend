
import { MOCK_STATE } from '../mockData';
import { User, Subject, Unit, MicroLesson, Quiz, Content } from '../types';

export const fetchUser = async (userId: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.user);
    }, 500);
  });
};

export const fetchSubjectsByClass = async (classId: string): Promise<Subject[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.subjects.filter(s => s.classId === classId));
    }, 500);
  });
};

export const fetchUnitsBySubject = async (subjectId: string): Promise<Unit[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.units.filter(u => u.subjectId === subjectId));
    }, 500);
  });
};

export const fetchMicroLessonsByUnit = async (unitId: string): Promise<MicroLesson[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.microLessons.filter(l => l.unitId === unitId));
    }, 500);
  });
};

export const fetchQuizByLesson = async (lessonId: string): Promise<Quiz | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.quizzes.find(q => q.lessonId === lessonId) || null);
    }, 500);
  });
};

export const fetchContentsBySubject = async (subjectId: string): Promise<Content[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATE.contents.filter(c => c.subjectId === subjectId));
    }, 500);
  });
};
