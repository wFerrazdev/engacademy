/**
 * Regras de manutenção da sequência de dias consecutivos de estudo (streak).
 *
 * As funções são puras e operam sobre datas no formato ISO local
 * (AAAA-MM-DD), o que as torna determinísticas e verificáveis
 * independentemente do fuso horário do servidor de renderização.
 */

/** Converte um objeto Date para a representação local AAAA-MM-DD. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Diferença, em dias inteiros, entre duas datas no formato AAAA-MM-DD. */
export function daysBetween(fromIsoDate: string, toIsoDateValue: string): number {
  const from = new Date(`${fromIsoDate}T00:00:00`);
  const to = new Date(`${toIsoDateValue}T00:00:00`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / millisecondsPerDay);
}

/**
 * Calcula o novo valor da sequência de estudo.
 *
 * - Mesma data da última atividade: a sequência é mantida (não há dupla contagem).
 * - Exatamente um dia depois: a sequência é incrementada.
 * - Qualquer intervalo maior, ou primeira atividade: a sequência reinicia em 1.
 */
export function nextStreak(
  currentStreak: number,
  lastStudyDate: string | null,
  today: string
): number {
  if (!lastStudyDate) return 1;

  const elapsedDays = daysBetween(lastStudyDate, today);

  if (elapsedDays === 0) return Math.max(1, currentStreak);
  if (elapsedDays === 1) return Math.max(1, currentStreak) + 1;
  return 1;
}
