"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StudentProfile, LearningModule, QuizAttemptResult, PersistedState } from '../types';
import { mockStudentProfile, mockMathModules, mockPhysicsModules } from '../mocks';
import {
  XP_PER_CORRECT_ANSWER,
  XP_MODULE_COMPLETION_BONUS,
  MIN_APPROVAL_SCORE,
  STORAGE_KEY,
} from '@/config/gamification';
import { levelFromXP, scoreToPercent, isApproved } from '@/lib/progression';
import { toIsoDate, nextStreak } from '@/lib/streak';

export interface StudentContextType {
  profile: StudentProfile;
  mathModules: LearningModule[];
  physicsModules: LearningModule[];
  /** Indica que o estado persistido já foi reidratado no cliente. */
  isHydrated: boolean;
  /** Registra o resultado de uma tentativa de quiz e aplica as regras do motor. */
  submitQuizAttempt: (
    moduleId: string,
    correctAnswers: number,
    totalQuestions: number
  ) => QuizAttemptResult;
  /** Restaura o estado inicial da plataforma (uso em demonstrações). */
  resetProgress: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

/** Localiza a trilha ('math' | 'physics') à qual um módulo pertence. */
function findTrackOf(
  moduleId: string,
  math: LearningModule[],
  physics: LearningModule[]
): 'math' | 'physics' | null {
  if (math.some((m) => m.id === moduleId)) return 'math';
  if (physics.some((m) => m.id === moduleId)) return 'physics';
  return null;
}

/**
 * Aplica o resultado de uma tentativa sobre a lista de módulos de uma trilha.
 * O módulo recebe o melhor aproveitamento já obtido e o módulo imediatamente
 * seguinte só é desbloqueado quando o critério de aprovação é satisfeito.
 */
function applyAttemptToTrack(
  modules: LearningModule[],
  moduleId: string,
  scorePercent: number,
  approved: boolean
): { modules: LearningModule[]; unlockedNextModule: boolean } {
  const index = modules.findIndex((m) => m.id === moduleId);
  if (index === -1) return { modules, unlockedNextModule: false };

  const nextModule = modules[index + 1];
  const shouldUnlockNext = approved && !!nextModule && !nextModule.isUnlocked;

  const updated = modules.map((mod, idx) => {
    if (idx === index) {
      return { ...mod, progress: Math.max(mod.progress, scorePercent) };
    }
    if (idx === index + 1 && approved) {
      return { ...mod, isUnlocked: true };
    }
    return mod;
  });

  return { modules: updated, unlockedNextModule: shouldUnlockNext };
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(mockStudentProfile);
  const [mathModules, setMathModules] = useState<LearningModule[]>(mockMathModules);
  const [physicsModules, setPhysicsModules] = useState<LearningModule[]>(mockPhysicsModules);
  const [isHydrated, setIsHydrated] = useState(false);

  // Reidratação: executada apenas no cliente, após a renderização inicial do
  // servidor, evitando divergência de marcação (hydration mismatch).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PersistedState;
        if (saved.profile && saved.mathModules && saved.physicsModules) {
          setProfile(saved.profile);
          setMathModules(saved.mathModules);
          setPhysicsModules(saved.physicsModules);
        }
      }
    } catch {
      // Estado corrompido ou armazenamento indisponível: mantém o estado inicial.
    }
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persistência: grava a cada alteração relevante, somente após a reidratação.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const snapshot: PersistedState = { profile, mathModules, physicsModules };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Armazenamento indisponível (modo privativo, cota excedida): ignora.
    }
  }, [profile, mathModules, physicsModules, isHydrated]);

  const submitQuizAttempt = useCallback(
    (moduleId: string, correctAnswers: number, totalQuestions: number): QuizAttemptResult => {
      const scorePercent = scoreToPercent(correctAnswers, totalQuestions);
      const approved = isApproved(scorePercent);

      const track = findTrackOf(moduleId, mathModules, physicsModules);
      const sourceModules = track === 'physics' ? physicsModules : mathModules;
      const previousProgress = sourceModules.find((m) => m.id === moduleId)?.progress ?? 0;

      // O bônus de conclusão é concedido apenas na primeira aprovação do módulo,
      // impedindo acúmulo indevido de XP por repetição da mesma tentativa.
      const isFirstApproval = approved && previousProgress < MIN_APPROVAL_SCORE;
      const earnedXP =
        correctAnswers * XP_PER_CORRECT_ANSWER +
        (isFirstApproval ? XP_MODULE_COMPLETION_BONUS : 0);

      let unlockedNextModule = false;

      if (track === 'physics') {
        const result = applyAttemptToTrack(physicsModules, moduleId, scorePercent, approved);
        unlockedNextModule = result.unlockedNextModule;
        setPhysicsModules(result.modules);
      } else if (track === 'math') {
        const result = applyAttemptToTrack(mathModules, moduleId, scorePercent, approved);
        unlockedNextModule = result.unlockedNextModule;
        setMathModules(result.modules);
      }

      const today = toIsoDate(new Date());
      setProfile((prev) => {
        const experiencePoints = prev.experiencePoints + earnedXP;
        const currentStreak = nextStreak(prev.currentStreak, prev.lastStudyDate, today);
        return {
          ...prev,
          experiencePoints,
          currentLevel: levelFromXP(experiencePoints),
          currentStreak,
          longestStreak: Math.max(prev.longestStreak, currentStreak),
          lastStudyDate: today,
        };
      });

      return {
        moduleId,
        correctAnswers,
        totalQuestions,
        scorePercent,
        approved,
        earnedXP,
        unlockedNextModule,
      };
    },
    [mathModules, physicsModules]
  );

  const resetProgress = useCallback(() => {
    setProfile(mockStudentProfile);
    setMathModules(mockMathModules);
    setPhysicsModules(mockPhysicsModules);
  }, []);

  return (
    <StudentContext.Provider
      value={{
        profile,
        mathModules,
        physicsModules,
        isHydrated,
        submitQuizAttempt,
        resetProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}

export const useStudentContext = useStudent;
