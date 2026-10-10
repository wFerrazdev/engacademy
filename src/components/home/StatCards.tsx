"use client";

import { useEffect, useState } from "react";
import { BoltIcon, FlameIcon, LevelBadge } from "@/components/icons";
import { useCountUp } from "@/hooks/useMotion";
import { toIsoDate } from "@/lib/streak";

const WEEKDAY_LETTERS = ["D", "S", "T", "Q", "Q", "S", "S"];

function shiftIsoDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Dias da última semana em que houve estudo, a partir da sequência atual. */
function studiedDates(streak: number, lastStudyDate: string | null): Set<string> {
  const dates = new Set<string>();
  if (!lastStudyDate || streak <= 0) return dates;
  for (let k = 0; k < Math.min(streak, 7); k++) dates.add(shiftIsoDate(lastStudyDate, -k));
  return dates;
}

// sequência

interface StreakCardProps {
  streak: number;
  previousStreak: number | null;
  lastStudyDate: string | null;
  ready: boolean;
}

export function StreakCard({ streak, previousStreak, lastStudyDate, ready }: StreakCardProps) {
  const shown = useCountUp(streak, previousStreak, ready);
  const grew = ready && previousStreak !== null && streak > previousStreak;
  // A data só é lida no cliente (após a hidratação), para não divergir do servidor.
  const today = ready ? toIsoDate(new Date()) : null;

  const studied = studiedDates(streak, lastStudyDate);
  const week = today
    ? Array.from({ length: 7 }, (_, i) => {
        const iso = shiftIsoDate(today, i - 6);
        return { iso, letter: WEEKDAY_LETTERS[new Date(`${iso}T00:00:00`).getDay()], on: studied.has(iso), isToday: i === 6 };
      })
    : [];

  return (
    <div className="card flex flex-col gap-5 p-5">
      <div className="flex items-center gap-3">
        <div className={grew ? "anim-jump" : undefined}>
          <FlameIcon />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-stat font-extrabold text-flame-ink">{shown}</span>
          <span className="text-sm font-semibold text-ink-soft">{streak === 1 ? "dia seguido" : "dias seguidos"}</span>
        </div>
      </div>
      <ol className="grid grid-cols-7 gap-1.5" aria-label="Dias estudados nos últimos sete dias">
        {week.map((day) => (
          <li key={day.iso} className="flex flex-col items-center gap-1 text-cap font-bold text-ink-soft">
            <span
              className={`size-[22px] rounded-full border-2 ${
                day.on ? "border-flame-ink bg-flame" : "border-lock-deep bg-lock"
              } ${day.isToday ? "outline-2 outline-offset-2 outline-flame-ink" : ""}`}
            />
            <span>{day.letter}</span>
            <span className="sr-only">{day.on ? "estudou" : "não estudou"}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// nível e XP

/** Barra de XP: começa no último valor visto e enche até o atual. */
function XpFill({ from, to }: { from: number; to: number }) {
  const [fill, setFill] = useState(from);
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setFill(to)));
    return () => cancelAnimationFrame(frame);
  }, [to]);
  return (
    <span
      className="bar-fill bg-gold shadow-[inset_0_-4px_0_var(--color-gold-deep)]"
      style={{ transform: `scaleX(${fill})` }}
    />
  );
}

interface ProgressCardProps {
  xp: number;
  previousXp: number | null;
  level: number;
  previousLevel: number | null;
  withinLevel: number;
  previousWithinLevel: number | null;
  perLevel: number;
  ready: boolean;
}

export function ProgressCard({
  xp,
  previousXp,
  level,
  previousLevel,
  withinLevel,
  previousWithinLevel,
  perLevel,
  ready,
}: ProgressCardProps) {
  const shownXp = useCountUp(xp, previousXp, ready);
  const leveledUp = ready && previousLevel !== null && level > previousLevel;
  // O aviso de nível novo aparece, fica 2,2 s na tela e some.
  const [toastPhase, setToastPhase] = useState<"shown" | "leaving" | "gone">("shown");
  const toast = leveledUp && toastPhase !== "gone";

  useEffect(() => {
    if (!leveledUp) return;
    const timer = window.setTimeout(() => setToastPhase("leaving"), 2200);
    return () => window.clearTimeout(timer);
  }, [leveledUp]);

  return (
    <div className="card relative flex flex-col gap-5 p-5">
      {toast && (
        <span
          role="status"
          onAnimationEnd={() => {
            if (toastPhase === "leaving") setToastPhase("gone");
          }}
          className={`${toastPhase === "leaving" ? "anim-exit" : "anim-pop"} absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[10px] bg-purple px-3 py-1.5 text-cap font-bold uppercase tracking-wider text-white shadow-[0_3px_0_var(--color-purple-deep)]`}
        >
          Subiu de nível!
        </span>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <LevelBadge level={level} className={leveledUp ? "anim-pop shrink-0" : "shrink-0"} />
          <span className="text-stat font-extrabold text-purple">Nível {level}</span>
        </div>
        <div className="flex items-center gap-2">
          <BoltIcon className="h-11 w-auto" />
          <div className="flex flex-col">
            <span className="text-h2 font-extrabold leading-none text-ink">{shownXp}</span>
            <span className="text-cap font-bold text-ink-soft">XP no total</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div
          className="bar-track h-[18px] border-2 border-line-deep"
          role="progressbar"
          aria-label="Progresso até o próximo nível"
          aria-valuemin={0}
          aria-valuemax={perLevel}
          aria-valuenow={withinLevel}
        >
          {ready && <XpFill from={(previousWithinLevel ?? 0) / perLevel} to={withinLevel / perLevel} />}
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 text-sm font-semibold text-ink-soft">
          <span>
            {withinLevel} de {perLevel} XP neste nível
          </span>
          <span>
            faltam {perLevel - withinLevel} para o nível {level + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
