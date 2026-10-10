"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LearningModule, QuizAttemptResult, QuizQuestion } from "@/types";
import { useStudentContext } from "@/context/StudentContext";
import { MIN_APPROVAL_SCORE, XP_PER_CORRECT_ANSWER } from "@/config/gamification";
import { CheckIcon, CloseIcon } from "@/components/icons";
import ScratchPad from "@/components/lesson/ScratchPad";

const KEYS = ["A", "B", "C", "D", "E", "F"];

interface LessonViewProps {
  module: LearningModule;
  questions: QuizQuestion[];
}

/** Separa a explicação ("Passo 1: ...\n\nPasso 2: ...") em passos numerados. */
function steps(explanation: string): string[] {
  return explanation
    .split(/\n\s*\n/)
    .map((block) => block.replace(/^Passo\s*\d+\s*:\s*/i, "").trim())
    .filter(Boolean);
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card flex min-w-28 flex-1 flex-col items-center gap-1 px-4 py-3">
      <span className="label-caps">{label}</span>
      <span className="text-h3 font-extrabold">{value}</span>
    </div>
  );
}

/**
 * Tela da lição: uma questão por vez, com o rascunho ao lado.
 * XP, aprovação e desbloqueio são calculados no submitQuizAttempt (StudentContext).
 */
export default function LessonView({ module: mod, questions }: LessonViewProps) {
  const { submitQuizAttempt } = useStudentContext();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);

  const trailHref = mod.subject === "FISICA" ? "/trilhas/fisica" : "/trilhas/matematica";
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const isRight = checked && selected === question?.correctOptionIndex;
  const answered = index + (checked ? 1 : 0);

  // Teclas 1 a 4 escolhem a alternativa.
  useEffect(() => {
    if (checked || result) return;
    const onKey = (event: KeyboardEvent) => {
      const n = Number(event.key);
      if (Number.isInteger(n) && n >= 1 && n <= (question?.options.length ?? 0)) setSelected(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checked, result, question]);

  const verify = () => {
    if (selected === null || checked) return;
    setChecked(true);
    if (selected === question.correctOptionIndex) setCorrectAnswers((n) => n + 1);
  };

  const next = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
      return;
    }
    // A tentativa só é consolidada no fim: o desbloqueio depende do aproveitamento agregado.
    setResult(submitQuizAttempt(mod.id, correctAnswers, questions.length));
  };

  const retry = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectAnswers(0);
    setResult(null);
  };

  // tela de resultado
  if (result) {
    const approved = result.approved;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg px-4 py-10 text-center">
        <div
          className={`anim-pop grid size-28 place-items-center rounded-full ${
            approved ? "bg-ok shadow-[0_6px_0_var(--color-ok-deep)]" : "bg-gold shadow-[0_6px_0_var(--color-gold-deep)]"
          }`}
          aria-hidden="true"
        >
          {approved ? (
            <CheckIcon className="size-16" />
          ) : (
            <span className="text-h1 font-extrabold text-ink">!</span>
          )}
        </div>

        <div className="flex max-w-lg flex-col gap-2">
          <h1 className="text-h1 font-bold">{approved ? "Módulo concluído!" : "Aproveitamento insuficiente"}</h1>
          <p className="text-body text-ink-soft">
            {approved
              ? result.unlockedNextModule
                ? "O próximo módulo da trilha foi desbloqueado."
                : `Você concluiu ${mod.title}.`
              : `São necessários ${MIN_APPROVAL_SCORE}% de aproveitamento para desbloquear o próximo módulo.`}
          </p>
        </div>

        <div className="flex w-full max-w-lg flex-wrap justify-center gap-3">
          <ResultStat label="Acertos" value={`${result.correctAnswers} de ${result.totalQuestions}`} />
          <ResultStat label="Aproveitamento" value={`${result.scorePercent}%`} />
          <ResultStat label="XP" value={`+${result.earnedXP}`} />
        </div>

        <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row-reverse">
          {approved ? (
            <Link href={trailHref} className="btn btn-ok flex-1">
              Voltar para a trilha
            </Link>
          ) : (
            <>
              <button type="button" className="btn flex-1" onClick={retry}>
                Tentar novamente
              </button>
              <Link href={trailHref} className="btn btn-ghost flex-1">
                Voltar para a trilha
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // tela da questão
  return (
    <div className="flex h-dvh flex-col bg-surface">
      <header className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
        <Link
          href={trailHref}
          aria-label="Sair da lição"
          className="grid size-11 place-items-center rounded-[10px] text-ink-soft transition-colors duration-[var(--d-fast)] ease-out hover:bg-bg hover:text-ink focus-visible:outline-3 focus-visible:outline-purple"
        >
          <CloseIcon />
        </Link>
        <div
          className="bar-track h-4"
          role="progressbar"
          aria-label="Progresso da lição"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answered}
        >
          <span
            className="bar-fill bg-purple shadow-[inset_0_-4px_0_var(--color-purple-deep)] transition-transform duration-[var(--d-base)]"
            style={{ transform: `scaleX(${answered / questions.length})` }}
          />
        </div>
        <span className="text-sm font-bold text-ink-soft">
          {index + 1} de {questions.length}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-8 pt-2 sm:px-6 lg:h-full lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-5">
            <span className="label-caps">{mod.title}</span>
            <h1 className="text-h3 font-bold leading-snug">{question.questionText}</h1>

            <div className="flex flex-col gap-3" role="group" aria-label="Alternativas">
              {question.options.map((option, i) => {
                let state = "";
                if (checked && i === question.correctOptionIndex) state = isRight ? "is-right anim-pop" : "is-right";
                else if (checked && i === selected) state = "is-wrong anim-shake";
                else if (!checked && i === selected) state = "is-selected";
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={selected === i}
                    data-key={KEYS[i]}
                    disabled={checked}
                    onClick={() => setSelected(i)}
                    className={`opt ${state}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {checked && (
              <section className="anim-slide-up card flex flex-col gap-3 p-5" aria-label="Resolução">
                <span className="label-caps">Resolução passo a passo</span>
                <ol className="flex list-decimal flex-col gap-2 pl-5 text-body marker:font-bold marker:text-purple">
                  {steps(question.explanation).map((step, i) => (
                    <li key={i} className="whitespace-pre-line pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <ScratchPad storageKey={`engacademy:rascunho:${mod.id}`} />
        </div>
      </main>

      <footer
        className={`border-t-2 transition-colors duration-[var(--d-base)] ease-out ${
          !checked ? "border-line bg-surface" : isRight ? "border-transparent bg-ok-wash" : "border-transparent bg-err-wash"
        }`}
      >
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:grid-cols-[1fr_auto] sm:px-6">
          <div className="min-w-0" aria-live="polite">
            {!checked ? (
              <span className="text-sm text-ink-soft">Escolha uma alternativa e confira.</span>
            ) : isRight ? (
              <p className="anim-slide-up text-h3 font-extrabold text-ok-deep">Mandou bem! +{XP_PER_CORRECT_ANSWER} XP</p>
            ) : (
              <p className="anim-slide-up text-h3 font-extrabold text-err-deep">
                Resposta correta: {question.options[question.correctOptionIndex]}
              </p>
            )}
          </div>
          {!checked ? (
            <button type="button" className="btn min-w-40" disabled={selected === null} onClick={verify}>
              Verificar
            </button>
          ) : (
            <button type="button" className={`btn min-w-40 ${isRight ? "btn-ok" : "btn-err"}`} onClick={next}>
              {isLast ? "Ver resultado" : "Continuar"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
