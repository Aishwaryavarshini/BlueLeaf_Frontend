
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import PendingApprovalScreen from './screens/PendingApprovalScreen';
import InstituteComingSoonScreen from './screens/InstituteComingSoonScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import InstituteAffiliationScreen from './screens/InstituteAffiliationScreen';
import ClassSelectionScreen from './screens/ClassSelectionScreen';
import OnboardingTutorialScreen from './screens/OnboardingTutorialScreen';
import StudentDashboard from './screens/StudentDashboard';
import UnitListScreen from './screens/UnitListScreen';
import MicroLessonPathScreen from './screens/MicroLessonPathScreen';
import LessonTeachingScreen from './screens/LessonTeachingScreen';
import QuizScreen from './screens/QuizScreen';
import MindMapScreen from './screens/MindMapScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import KeyFormulasScreen from './screens/KeyFormulasScreen';
import UploadNotesScreen from './screens/UploadNotesScreen';
import FacultyDashboard from './screens/FacultyDashboard';
import FacultyCurriculumManagementScreen from './screens/FacultyCurriculumManagementScreen';
import SubjectSyllabusScreen from './screens/SubjectSyllabusScreen';
import PrincipalDashboard from './screens/PrincipalDashboard';
import AddStaffScreen from './screens/AddStaffScreen';
import PrincipalClassViewScreen from './screens/PrincipalClassViewScreen';
import PrincipalSubjectViewScreen from './screens/PrincipalSubjectViewScreen';
import PrincipalStudentProfileScreen from './screens/PrincipalStudentProfileScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';

export enum AppScreen {
  WELCOME = 'welcome',
  LOGIN = 'login',
  SIGN_UP = 'sign_up',
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  PENDING_APPROVAL = 'pending_approval',
  LANGUAGE_SELECTION = 'language_selection',
  INSTITUTE_AFFILIATION = 'institute_affiliation',
  CLASS_SELECTION = 'class_selection',
  ONBOARDING_TUTORIAL = 'onboarding_tutorial',
  STUDENT_DASHBOARD = 'student_dashboard',
  UNIT_LIST = 'unit_list',
  MICRO_LESSON_PATH = 'micro_lesson_path',
  LESSON_TEACHING = 'lesson_teaching',
  QUIZ = 'quiz',
  MIND_MAP = 'mind_map',
  FLASHCARDS = 'flashcards',
  KEY_FORMULAS = 'key_formulas',
  UPLOAD_NOTES = 'upload_notes',
  FACULTY_DASHBOARD = 'faculty_dashboard',
  FACULTY_CURRICULUM_MANAGEMENT = 'faculty_curriculum_management',
  SUBJECT_SYLLABUS = 'subject_syllabus',
  PRINCIPAL_DASHBOARD = 'principal_dashboard',
  ADD_STAFF = 'add_staff',
  PRINCIPAL_CLASS_VIEW = 'principal_class_view',
  PRINCIPAL_SUBJECT_VIEW = 'principal_subject_view',
  PRINCIPAL_STUDENT_PROFILE = 'principal_student_profile',
  STUDENT_PROFILE = 'student_profile',
  INSTITUTE_COMING_SOON = 'institute_coming_soon',
}

export type FlashcardMode = 'speak' | 'type' | 'self' | 'ask_every_time';

export interface MindMapPreferences {
  density: 'low' | 'normal' | 'high';
  focus: 'concepts' | 'exam' | 'balanced';
  layout: 'branched' | 'linear';
}

export interface UserPreferences {
  username: string;
  role: string; // 'Student' or 'Principal' or 'Subject Teacher' or 'Class Teacher'
  language: string;
  instituteName: string;
  belongsToInstitute: boolean;
  selectedClass: number | null;
  assignedSubject?: string;
  assignedClasses?: number[];
  streak: number;
  lastActivityTimestamp: number;
  mindMapPrefs: MindMapPreferences;
  selectedVoice: string;
  learningGoal: string; 
  specificGoal: string; 
  learningStyle: string;
  preferredFlashcardMode: FlashcardMode;
  status?: 'Pending' | 'Active';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  username: 'Learner',
  role: '',
  language: 'English',
  instituteName: '',
  belongsToInstitute: false,
  selectedClass: null,
  streak: 3,
  lastActivityTimestamp: Date.now(),
  mindMapPrefs: {
    density: 'normal',
    focus: 'balanced',
    layout: 'branched'
  },
  selectedVoice: 'Friendly & Cheerful',
  learningGoal: 'Concept Mastery',
  specificGoal: 'Improve overall understanding',
  learningStyle: 'Visual',
  preferredFlashcardMode: 'ask_every_time',
  status: 'Active'
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.WELCOME);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [facultyClassContext, setFacultyClassContext] = useState<string>('Class 9');
  
  // Principal Drill-down state
  const [selectedPrincipalClass, setSelectedPrincipalClass] = useState<string>('');
  const [selectedPrincipalSubject, setSelectedPrincipalSubject] = useState<string>('');
  const [selectedPrincipalStudentId, setSelectedPrincipalStudentId] = useState<string>('');

  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const checkStreak = () => {
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (now - userPreferences.lastActivityTimestamp > oneDayInMs) {
        setUserPreferences(prev => ({ ...prev, streak: 0, lastActivityTimestamp: now }));
      }
    };
    checkStreak();
  }, [currentScreen]);

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
    if (screen !== AppScreen.LOGIN) setLoginFeedback(null);
  };

  const handleLogout = () => {
    setUserPreferences(DEFAULT_PREFERENCES);
    navigateTo(AppScreen.WELCOME);
  };

  const handleLoginSuccess = (email: string) => {
    const lowerEmail = email.toLowerCase();
    
    // --- DEMO ROUTING LOGIC (FRONTEND ONLY) ---
    if (lowerEmail === 'principal@demo.com') {
      setUserPreferences({
        ...DEFAULT_PREFERENCES,
        username: 'Rajesh',
        role: 'Principal',
        instituteName: 'Tamil Nadu Government School',
        belongsToInstitute: true,
        assignedClasses: Array.from({ length: 12 }, (_, i) => i + 1),
        selectedClass: 9
      });
      navigateTo(AppScreen.PRINCIPAL_DASHBOARD);
      return;
    }
    
    // 1️⃣ CLASS TEACHER + SUBJECT TEACHER VIEW
    if (lowerEmail === 'classstaff@demo.com') {
      setUserPreferences({
        ...DEFAULT_PREFERENCES,
        username: 'Kavitha',
        role: 'Class Teacher',
        instituteName: 'Tamil Nadu Government School',
        belongsToInstitute: true,
        assignedSubject: 'Mathematics',
        assignedClasses: [9],
        selectedClass: 9
      });
      navigateTo(AppScreen.FACULTY_DASHBOARD);
      return;
    }

    // 2️⃣ SUBJECT-ONLY STAFF VIEW
    if (lowerEmail === 'subjectstaff@demo.com') {
      setUserPreferences({
        ...DEFAULT_PREFERENCES,
        username: 'Arun',
        role: 'Subject Teacher',
        instituteName: 'Tamil Nadu Government School',
        belongsToInstitute: true,
        assignedSubject: 'Science',
        assignedClasses: [9],
        selectedClass: 9
      });
      navigateTo(AppScreen.FACULTY_DASHBOARD);
      return;
    }

    if (lowerEmail === 'student@demo.com') {
      setUserPreferences({
        ...DEFAULT_PREFERENCES,
        username: 'Ramanathan',
        role: 'Student',
        language: 'Tamil',
        instituteName: 'Tamil Nadu Government School',
        belongsToInstitute: true,
        selectedClass: 9
      });
      navigateTo(AppScreen.STUDENT_DASHBOARD);
      return;
    }
    // --- END DEMO ROUTING LOGIC ---

    const isPrincipal = lowerEmail.includes('admin');
    const isPending = lowerEmail.includes('pending');
    
    // Dynamic name from email
    const emailPrefix = email.split('@')[0];
    const dynamicName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    let demoPrefs: Partial<UserPreferences> = {
      username: isPrincipal ? 'Rajesh' : (isPending ? 'Priya' : dynamicName),
      role: isPrincipal ? 'Principal' : 'Student',
      language: 'Tamil',
      instituteName: 'Tamil Nadu Government School',
      belongsToInstitute: true,
      streak: 5,
      lastActivityTimestamp: Date.now(),
      status: isPending ? 'Pending' : 'Active',
      selectedClass: 9
    };

    if (isPrincipal) {
      demoPrefs.assignedClasses = Array.from({ length: 12 }, (_, i) => i + 1);
      setUserPreferences(prev => ({ ...prev, ...demoPrefs }));
      navigateTo(AppScreen.PRINCIPAL_DASHBOARD);
    } else if (isPending) {
      setUserPreferences(prev => ({ ...prev, ...demoPrefs }));
      navigateTo(AppScreen.PENDING_APPROVAL);
    } else {
      setUserPreferences(prev => ({ ...prev, ...demoPrefs }));
      navigateTo(AppScreen.STUDENT_DASHBOARD);
    }
  };

  const handleSignUpSuccess = (data: any) => {
    setUserPreferences(prev => ({
      ...prev,
      username: data.name,
      role: data.role === 'institution' ? 'Principal' : 'Student',
      instituteName: data.institute || 'Tamil Nadu Government School',
      belongsToInstitute: !!data.institute,
      status: data.status,
      selectedClass: data.selectedClass || null,
      language: data.language || 'English',
      lastActivityTimestamp: Date.now(),
    }));
    
    if (data.role === 'institution') {
      navigateTo(AppScreen.PRINCIPAL_DASHBOARD);
    } else {
      navigateTo(AppScreen.PENDING_APPROVAL);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.WELCOME:
        return <WelcomeScreen onStart={() => navigateTo(AppScreen.SIGN_UP)} onLogin={() => navigateTo(AppScreen.LOGIN)} />;
      case AppScreen.LOGIN:
        return <LoginScreen onSuccess={handleLoginSuccess} onBack={() => navigateTo(AppScreen.WELCOME)} onGoToSignUp={() => navigateTo(AppScreen.SIGN_UP)} onForgotPassword={() => navigateTo(AppScreen.FORGOT_PASSWORD)} feedbackMessage={loginFeedback} />;
      case AppScreen.SIGN_UP:
        return <SignUpScreen onSuccess={handleSignUpSuccess} onBack={() => navigateTo(AppScreen.WELCOME)} />;
      case AppScreen.FORGOT_PASSWORD:
        return <ForgotPasswordScreen onBack={() => navigateTo(AppScreen.LOGIN)} />;
      case AppScreen.RESET_PASSWORD:
        return <ResetPasswordScreen onSuccess={() => { setLoginFeedback('Password updated successfully'); navigateTo(AppScreen.LOGIN); }} />;
      case AppScreen.PENDING_APPROVAL:
        return <PendingApprovalScreen onBack={() => navigateTo(AppScreen.WELCOME)} />;
      case AppScreen.PRINCIPAL_DASHBOARD:
        return (
          <PrincipalDashboard
            preferences={userPreferences}
            onLogout={handleLogout}
            onAddStaff={() => navigateTo(AppScreen.ADD_STAFF)}
            onSelectClass={(cls) => {
              setSelectedPrincipalClass(cls);
              navigateTo(AppScreen.PRINCIPAL_CLASS_VIEW);
            }}
          />
        );
      case AppScreen.ADD_STAFF:
        return (
          <AddStaffScreen
            preferences={userPreferences}
            onBack={() => navigateTo(AppScreen.PRINCIPAL_DASHBOARD)}
            onSuccess={() => navigateTo(AppScreen.PRINCIPAL_DASHBOARD)}
          />
        );
      case AppScreen.FACULTY_DASHBOARD:
        return (
          <FacultyDashboard
            preferences={userPreferences}
            onLogout={handleLogout}
            onSelectSubject={(subj, cls) => {
              setSelectedSubject(subj);
              setFacultyClassContext(cls);
              navigateTo(AppScreen.SUBJECT_SYLLABUS);
            }}
          />
        );
      case AppScreen.SUBJECT_SYLLABUS:
        return (
          <SubjectSyllabusScreen
            preferences={userPreferences}
            subjectName={selectedSubject}
            className={facultyClassContext}
            onBack={() => navigateTo(AppScreen.FACULTY_DASHBOARD)}
          />
        );
      case AppScreen.FACULTY_CURRICULUM_MANAGEMENT:
        return (
          <FacultyCurriculumManagementScreen
            preferences={userPreferences}
            subjectName={selectedSubject}
            className={facultyClassContext}
            onBack={() => navigateTo(AppScreen.FACULTY_DASHBOARD)}
          />
        );
      case AppScreen.PRINCIPAL_CLASS_VIEW:
        return (
          <PrincipalClassViewScreen 
            className={selectedPrincipalClass}
            onBack={() => navigateTo(AppScreen.PRINCIPAL_DASHBOARD)}
            onGoToDashboard={() => navigateTo(AppScreen.PRINCIPAL_DASHBOARD)}
            onSelectSubject={(subj) => {
              setSelectedPrincipalSubject(subj);
              navigateTo(AppScreen.PRINCIPAL_SUBJECT_VIEW);
            }}
          />
        );
      case AppScreen.PRINCIPAL_SUBJECT_VIEW:
        return (
          <PrincipalSubjectViewScreen 
            preferences={userPreferences}
            className={selectedPrincipalClass}
            subjectName={selectedPrincipalSubject}
            onBack={() => navigateTo(AppScreen.PRINCIPAL_CLASS_VIEW)}
            onGoToDashboard={() => navigateTo(AppScreen.PRINCIPAL_DASHBOARD)}
            onGoToClass={() => navigateTo(AppScreen.PRINCIPAL_CLASS_VIEW)}
            onSelectStudent={(student) => {
              setSelectedPrincipalStudentId(student.id.toString());
              navigateTo(AppScreen.PRINCIPAL_STUDENT_PROFILE);
            }}
          />
        );
      case AppScreen.PRINCIPAL_STUDENT_PROFILE:
        return (
          <PrincipalStudentProfileScreen 
            studentId={selectedPrincipalStudentId}
            onBack={() => navigateTo(AppScreen.PRINCIPAL_SUBJECT_VIEW)}
          />
        );
      case AppScreen.STUDENT_PROFILE:
        return (
          <StudentProfileScreen 
            preferences={userPreferences} 
            onBack={() => navigateTo(AppScreen.STUDENT_DASHBOARD)} 
          />
        );
      case AppScreen.STUDENT_DASHBOARD:
        return (
          <StudentDashboard 
            preferences={userPreferences}
            onSelectSubject={(subj) => { setSelectedSubject(subj); navigateTo(AppScreen.UNIT_LIST); }}
            onResumeLesson={(s, u, l) => { setSelectedSubject(s); setSelectedUnitName(u); setSelectedLessonTitle(l); navigateTo(AppScreen.LESSON_TEACHING); }}
            onTriggerUpload={() => navigateTo(AppScreen.UPLOAD_NOTES)}
            onUpdateVoice={(v) => setUserPreferences(prev => ({ ...prev, selectedVoice: v }))}
            onUpdatePreferences={(p) => setUserPreferences(prev => ({ ...prev, ...p }))}
            onLogout={handleLogout}
          />
        );
      case AppScreen.UNIT_LIST:
        return <UnitListScreen preferences={userPreferences} subjectName={selectedSubject} onBack={() => navigateTo(AppScreen.STUDENT_DASHBOARD)} onSelectUnit={(u) => { setSelectedUnitName(u); navigateTo(AppScreen.MICRO_LESSON_PATH); }} />;
      case AppScreen.MICRO_LESSON_PATH:
        return <MicroLessonPathScreen preferences={userPreferences} subjectName={selectedSubject} unitName={selectedUnitName} onBack={() => navigateTo(AppScreen.UNIT_LIST)} onSelectLesson={(l) => { setSelectedLessonTitle(l); navigateTo(AppScreen.LESSON_TEACHING); }} onSelectQuiz={() => navigateTo(AppScreen.QUIZ)} onSelectMindMap={() => navigateTo(AppScreen.MIND_MAP)} onSelectFlashcards={() => navigateTo(AppScreen.FLASHCARDS)} onSelectKeyFormulas={() => navigateTo(AppScreen.KEY_FORMULAS)} />;
      case AppScreen.LESSON_TEACHING:
        return <LessonTeachingScreen preferences={userPreferences} lessonTitle={selectedLessonTitle} onComplete={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} onBack={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} />;
      case AppScreen.QUIZ:
        return <QuizScreen preferences={userPreferences} unitName={selectedUnitName} lessonTitle={selectedLessonTitle} onComplete={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} onRevise={() => navigateTo(AppScreen.LESSON_TEACHING)} onExit={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} />;
      case AppScreen.MIND_MAP:
        return <MindMapScreen preferences={userPreferences} unitName={selectedUnitName} onBack={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} onUpdatePrefs={(p) => setUserPreferences(prev => ({ ...prev, mindMapPrefs: p }))} />;
      case AppScreen.FLASHCARDS:
        return <FlashcardsScreen preferences={userPreferences} unitName={selectedUnitName} onBack={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} />;
      case AppScreen.KEY_FORMULAS:
        return <KeyFormulasScreen preferences={userPreferences} unitName={selectedUnitName} onBack={() => navigateTo(AppScreen.MICRO_LESSON_PATH)} />;
      default:
        return <WelcomeScreen onStart={() => navigateTo(AppScreen.SIGN_UP)} onLogin={() => navigateTo(AppScreen.LOGIN)} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {renderScreen()}
    </div>
  );
};

export default App;
