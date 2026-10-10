"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStudent } from "@/context/StudentContext";
import { XP_PER_LEVEL, MIN_APPROVAL_SCORE } from "@/config/gamification";
import { levelFromXP, xpWithinLevel } from "@/lib/progression";
import { useLastSeen } from "@/hooks/useLastSeen";
import { ProgressCard, StreakCard } from "@/components/home/StatCards";
import { CheckIcon, LockIcon, StarIcon } from "@/components/icons";
import { ModuleStatus, statusLabel, statusOf } from "@/components/trail/status";
import { LearningModule } from "@/types";

interface HudSnapshot {
  xp: number;
  streak: number;
}

/** Versão em miniatura do nó da trilha, usada na lista de módulos. */
function MiniNode({ status }: { status: ModuleStatus }) {
  const tone =
    status === "done"
      ? "bg-ok shadow-[0_3px_0_var(--color-ok-deep)]"
      : status === "current"
        ? "bg-purple shadow-[0_3px_0_var(--color-purple-deep)]"
        : "bg-lock text-lock-ink shadow-[0_3px_0_var(--color-lock-deep)]";
  return (
    <span className={`grid size-9 shrink-0 place-items-center rounded-full ${tone}`} aria-hidden="true">
      {status === "done" && <CheckIcon className="size-5" />}
      {status === "current" && <StarIcon className="size-5" />}
      {status === "locked" && <LockIcon className="size-5" />}
    </span>
  );
}

function TrackSummary({ title, href, modules }: { title: string; href: string; modules: LearningModule[] }) {
  const completed = modules.filter((mod) => statusOf(mod) === "done").length;
  return (
    <Link
      href={href}
      className="card flex flex-col gap-4 p-5 transition-colors duration-[var(--d-fast)] ease-out hover:bg-bg focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-purple"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-h3 font-bold">{title}</h3>
        <span className="text-sm font-semibold text-ink-soft">
          {completed} de {modules.length} concluídos
        </span>
      </div>
      <div className="bar-track h-3">
        <span
          className="bar-fill bg-purple"
          style={{ transform: `scaleX(${modules.length ? completed / modules.length : 0})` }}
        />
      </div>
      <ul className="flex flex-col gap-3">
        {modules.map((mod) => {
          const status = statusOf(mod);
          return (
            <li key={mod.id} className="flex items-center gap-3">
              <MiniNode status={status} />
              <div className="flex min-w-0 flex-col">
                <span className={`font-semibold leading-snug ${status === "locked" ? "text-ink-soft" : "text-ink"}`}>
                  {mod.title}
                </span>
                <span
                  className={`text-cap font-bold uppercase tracking-wider ${
                    status === "done" ? "text-ok" : status === "current" ? "text-purple" : "text-ink-soft"
                  }`}
                >
                  {statusLabel(mod)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Link>
  );
}

export default function Home() {
  const { profile, mathModules, physicsModules, isHydrated } = useStudent();

  const level = levelFromXP(profile.experiencePoints);
  const withinLevel = xpWithinLevel(profile.experiencePoints);

  // Último estado visto nesta aba: permite animar só o que mudou desde a visita anterior.
  const snapshot = useMemo<HudSnapshot>(
    () => ({ xp: profile.experiencePoints, streak: profile.currentStreak }),
    [profile.experiencePoints, profile.currentStreak]
  );
  const previous = useLastSeen<HudSnapshot>("engacademy:hud", snapshot, isHydrated);
  const ready = isHydrated && previous !== undefined;
  const previousLevel = previous ? levelFromXP(previous.xp) : null;

  // A data só é lida no cliente (após a hidratação), para não divergir do servidor.
  const dateLabel = isHydrated
    ? new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
    : "";

  // Próximo módulo pendente: primeiro desbloqueado ainda sem aprovação, na ordem das trilhas.
  const nextModule =
    [...mathModules, ...physicsModules].find((mod) => mod.isUnlocked && mod.progress < MIN_APPROVAL_SCORE) ?? null;
  const nextTrack = nextModule?.subject === "FISICA" ? physicsModules : mathModules;
  const nextIndex = nextModule ? nextTrack.findIndex((mod) => mod.id === nextModule.id) + 1 : 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="min-h-[1.4em] text-sm font-semibold text-ink-soft first-letter:uppercase">{dateLabel}</span>
        <h1 className="text-h1 font-bold">Olá, {profile.name}!</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-label="Seu progresso">
        <StreakCard
          streak={profile.currentStreak}
          previousStreak={previous?.streak ?? null}
          lastStudyDate={profile.lastStudyDate}
          ready={ready}
        />
        <ProgressCard
          xp={profile.experiencePoints}
          previousXp={previous?.xp ?? null}
          level={level}
          previousLevel={previousLevel}
          withinLevel={withinLevel}
          previousWithinLevel={previous && previousLevel === level ? xpWithinLevel(previous.xp) : null}
          perLevel={XP_PER_LEVEL}
          ready={ready}
        />
      </section>

      <section className="card grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-[1fr_auto]" aria-label="Continuar estudando">
        {nextModule ? (
          <>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="label-caps">Continuar de onde parou</span>
              <h2 className="text-h3 font-bold">{nextModule.title}</h2>
              <span className="text-sm text-ink-soft">
                {nextModule.subject === "FISICA" ? "Física" : "Matemática"} · módulo {nextIndex} de {nextTrack.length}
              </span>
            </div>
            <Link href={`/licao/${nextModule.id}`} className="btn">
              Continuar
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <span className="label-caps">Trilhas concluídas</span>
              <h2 className="text-h3 font-bold">Você concluiu todos os módulos.</h2>
            </div>
            <Link href="/trilhas/matematica" className="btn btn-ghost">
              Revisar
            </Link>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Trilhas">
        <TrackSummary title="Matemática" href="/trilhas/matematica" modules={mathModules} />
        <TrackSummary title="Física" href="/trilhas/fisica" modules={physicsModules} />
      </section>
    </div>
  );
}
