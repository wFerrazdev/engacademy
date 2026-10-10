export interface StudentProfile {
  id: string;
  name: string;
  experiencePoints: number;
  currentLevel: number;
  currentStreak: number;
  /** Data (AAAA-MM-DD) da última atividade registrada; null se nunca estudou. */
  lastStudyDate: string | null;
  /** Maior sequência de dias consecutivos já alcançada pelo estudante. */
  longestStreak: number;
}

export interface LearningModule {
  id: string;
  title: string;
  subject: 'MATEMATICA' | 'FISICA';
  isUnlocked: boolean;
  /** Melhor aproveitamento percentual (0-100) obtido no quiz do módulo. */
  progress: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

/** Resultado consolidado de uma tentativa de quiz. */
export interface QuizAttemptResult {
  moduleId: string;
  correctAnswers: number;
  totalQuestions: number;
  scorePercent: number;
  approved: boolean;
  earnedXP: number;
  unlockedNextModule: boolean;
}

/** Estado serializável persistido localmente entre sessões. */
export interface PersistedState {
  profile: StudentProfile;
  mathModules: LearningModule[];
  physicsModules: LearningModule[];
}
