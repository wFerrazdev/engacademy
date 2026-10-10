"use client";

import { useEffect, useState } from "react";

/**
 * Guarda na sessionStorage o último valor mostrado numa tela, para animar só o
 * que mudou desde a última visita (XP que subiu, módulo concluído).
 * Retorna undefined enquanto lê, null na primeira visita, ou o valor anterior.
 */
export function useLastSeen<T>(key: string, current: T, ready: boolean): T | null | undefined {
  const [previous, setPrevious] = useState<T | null | undefined>(undefined);

  useEffect(() => {
    if (!ready || previous !== undefined) return;
    let stored: T | null = null;
    try {
      const raw = window.sessionStorage.getItem(key);
      stored = raw ? (JSON.parse(raw) as T) : null;
    } catch {
      stored = null;
    }
    // Só lê depois da hidratação, para não divergir do HTML do servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrevious(stored);
  }, [key, ready, previous]);

  useEffect(() => {
    if (!ready || previous === undefined) return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(current));
    } catch {
      // armazenamento indisponível: a tela só deixa de animar as mudanças
    }
  }, [key, current, ready, previous]);

  return previous;
}
