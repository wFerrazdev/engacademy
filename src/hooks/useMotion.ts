"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Indica se o usuário pediu movimento reduzido no sistema operacional. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

/**
 * Anima um número de `from` até `to`, como um contador.
 * Sem valor anterior ou com movimento reduzido, mostra o valor final direto.
 */
export function useCountUp(to: number, from: number | null, enabled: boolean): number {
  const reduced = useReducedMotion();
  const animate = enabled && !reduced && from !== null && from !== to;
  const [value, setValue] = useState(from ?? to);

  useEffect(() => {
    if (!animate || from === null) return;
    const duration = 600;
    let startTime: number | null = null;
    let frame = 0;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, from, to]);

  return animate ? value : to;
}
