"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LearningModule } from "@/types";
import { useStudentContext } from "@/context/StudentContext";
import { useLastSeen } from "@/hooks/useLastSeen";
import { CheckIcon, LockIcon, StarIcon } from "@/components/icons";
import { ModuleStatus, statusLabel, statusOf } from "@/components/trail/status";
import { TRAIL, nodeCenters, offsetFor, stonesBetween, trailHeight } from "@/components/trail/geometry";

interface TrilhaVerticalProps {
  label: string;
  title: string;
  modules: LearningModule[];
}

const STONE_CLASSES: Record<ModuleStatus, [string, string]> = {
  done: ["fill-stone-done", "fill-stone-done-deep"],
  current: ["fill-stone-current", "fill-stone-current-deep"],
  locked: ["fill-lock", "fill-lock-deep"],
};

type BubbleSide = "inline" | "side-left" | "side-right";

/** Anel de progresso em volta do módulo atual: mostra o melhor aproveitamento já obtido. */
function ProgressRing({ progress }: { progress: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(progress)));
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <svg className="pointer-events-none absolute -left-2.5 -top-2.5 size-24" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="44" fill="none" strokeWidth="6" className="stroke-line-deep" />
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset={100 - shown}
        transform="rotate(-90 48 48)"
        className="stroke-purple transition-[stroke-dashoffset] duration-[var(--d-count)] ease-out"
      />
    </svg>
  );
}

/**
 * Trilha em zigue-zague. Cada nó abre a lição do módulo, e as pedras entre
 * dois nós ficam com a cor do estado do módulo seguinte.
 */
export default function TrilhaVertical({ label, title, modules }: TrilhaVerticalProps) {
  const router = useRouter();
  const { isHydrated } = useStudentContext();
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const statuses = useMemo(() => modules.map(statusOf), [modules]);
  const previous = useLastSeen<ModuleStatus[]>(`engacademy:trail:${modules[0]?.subject ?? "trilha"}`, statuses, isHydrated);
  const changed = (i: number) => Array.isArray(previous) && previous[i] !== undefined && previous[i] !== statuses[i];

  const centers = useMemo(() => (width ? nodeCenters(modules.length, width) : []), [modules.length, width]);
  const current = statuses.indexOf("current");

  // O balão fica do lado de fora do zigue-zague; se não couber, vai para baixo do título.
  let bubbleSide: BubbleSide = "inline";
  if (current !== -1 && centers[current]) {
    const need = TRAIL.NODE_HALF_HEIGHT + TRAIL.BUBBLE_GAP + TRAIL.BUBBLE_WIDTH + 8;
    const x = centers[current].x;
    if (offsetFor(current) <= 0 && x - need >= 0) bubbleSide = "side-left";
    else if (offsetFor(current) > 0 && x + need <= width) bubbleSide = "side-right";
  }

  const segments = useMemo(
    () =>
      centers.slice(0, -1).map((a, i) => ({
        status: statuses[i + 1],
        stones: stonesBetween(a, centers[i + 1]),
      })),
    [centers, statuses]
  );

  const height = trailHeight(modules.length);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-0.5 rounded-card bg-purple px-6 py-5 text-white shadow-[0_var(--depth)_0_var(--color-purple-deep)]">
        <span className="text-cap font-bold uppercase tracking-wider text-purple-wash">{label}</span>
        <h1 className="text-h2 font-bold">{title}</h1>
      </header>

      <div ref={box} className="relative w-full" style={{ height }}>
        {width > 0 && (
          <>
            <svg className="pointer-events-none absolute inset-0 overflow-visible" width={width} height={height} aria-hidden="true">
              {segments.map((segment, i) => {
                const animate = changed(i + 1);
                return segment.stones.map((p, j) => (
                  <g key={`${i}-${j}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
                    <g
                      className={animate ? "anim-pop" : undefined}
                      style={animate ? { animationDelay: `calc(var(--delay-stones) + ${j} * var(--stagger))` } : undefined}
                    >
                      <ellipse cx="0" cy="3" rx="11" ry="7.5" className={STONE_CLASSES[segment.status][1]} />
                      <ellipse cx="0" cy="0" rx="11" ry="7.5" className={STONE_CLASSES[segment.status][0]} />
                    </g>
                  </g>
                ));
              })}
            </svg>

            {modules.map((mod, i) => {
              const status = statuses[i];
              const center = centers[i];
              const text = statusLabel(mod);
              const labelOnRight = offsetFor(i) <= 0;
              const justFinished = changed(i) && status === "done";
              const justUnlocked = changed(i) && status === "current";
              const bubbleText = mod.progress > 0 ? "CONTINUAR" : "COMEÇAR";

              return (
                <div key={mod.id}>
                  <div
                    className="absolute size-[76px]"
                    style={{ left: center.x - 38, top: center.y - TRAIL.NODE_HALF_HEIGHT }}
                  >
                    {status === "current" && <ProgressRing progress={mod.progress} />}
                    {i === current && bubbleSide !== "inline" && (
                      <span className={`trail-bubble anim-bob ${bubbleSide}`}>{bubbleText}</span>
                    )}
                    <button
                      type="button"
                      disabled={status === "locked"}
                      onClick={() => router.push(`/licao/${mod.id}`)}
                      aria-label={`${mod.title}, ${text.toLowerCase()}`}
                      className={`trail-node is-${status} ${justUnlocked ? "anim-pop" : ""}`}
                      style={justUnlocked ? { animationDelay: "var(--delay-unlock)" } : undefined}
                    >
                      {status === "done" && <CheckIcon className={justFinished ? "anim-pop" : undefined} />}
                      {status === "current" && <StarIcon />}
                      {status === "locked" && <LockIcon />}
                    </button>
                  </div>

                  <div
                    className={`absolute flex -translate-y-1/2 flex-col gap-1 ${
                      labelOnRight ? "items-start text-left" : "items-end text-right"
                    }`}
                    style={
                      labelOnRight
                        ? { top: center.y, left: center.x + 62, maxWidth: Math.max(100, width - center.x - 66) }
                        : { top: center.y, right: width - center.x + 62, maxWidth: Math.max(100, center.x - 66) }
                    }
                  >
                    <span className={`font-bold leading-snug ${status === "locked" ? "text-ink-soft" : "text-ink"}`}>
                      {mod.title}
                    </span>
                    <span
                      className={`text-cap font-bold uppercase tracking-wider ${
                        status === "done" ? "text-ok" : status === "current" ? "text-purple" : "text-ink-soft"
                      }`}
                    >
                      {text}
                    </span>
                    {i === current && bubbleSide === "inline" && (
                      <span className={`trail-bubble inline anim-bob ${labelOnRight ? "tail-left" : "tail-right"}`}>
                        {bubbleText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
