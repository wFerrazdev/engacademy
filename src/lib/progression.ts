import { MIN_APPROVAL_SCORE, XP_PER_LEVEL } from '@/config/gamification';

/**
 * Deriva o nível do estudante a partir do XP acumulado.
 * O nível é sempre uma função pura do XP, evitando estados divergentes
 * entre a pontuação exibida e o nível apresentado na interface.
 */
export function levelFromXP(experiencePoints: number): number {
  if (experiencePoints < 0) return 1;
  return Math.floor(experiencePoints / XP_PER_LEVEL) + 1;
}

/** XP acumulado dentro do nível corrente (0 a XP_PER_LEVEL - 1). */
export function xpWithinLevel(experiencePoints: number): number {
  if (experiencePoints < 0) return 0;
  return experiencePoints % XP_PER_LEVEL;
}

/** Converte o número de acertos em aproveitamento percentual inteiro. */
export function scoreToPercent(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  const ratio = correctAnswers / totalQuestions;
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
}

/** Verifica se o aproveitamento obtido atinge o critério de aprovação. */
export function isApproved(scorePercent: number): boolean {
  return scorePercent >= MIN_APPROVAL_SCORE;
}
