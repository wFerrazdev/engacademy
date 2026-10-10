"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentContext } from "@/context/StudentContext";
import { mockQuizzes } from "@/mocks";
import LessonView from "@/components/lesson/LessonView";

function Notice({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <h1 className="text-h2 font-bold">{title}</h1>
      <p className="max-w-md text-ink-soft">{text}</p>
      <Link href={href} className="btn">
        Voltar
      </Link>
    </div>
  );
}

/** Rota de uma lição. Garante que o módulo existe e já foi desbloqueado. */
export default function LicaoPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { mathModules, physicsModules, isHydrated } = useStudentContext();

  // Antes de reidratar o progresso salvo, ainda não dá para saber se o módulo está liberado.
  if (!isHydrated) return <div className="min-h-dvh bg-bg" aria-busy="true" />;

  const mod = [...mathModules, ...physicsModules].find((m) => m.id === moduleId);
  if (!mod) {
    return <Notice title="Lição não encontrada" text="Esse módulo não existe nas trilhas." href="/" />;
  }

  const trailHref = mod.subject === "FISICA" ? "/trilhas/fisica" : "/trilhas/matematica";
  if (!mod.isUnlocked) {
    return (
      <Notice
        title="Módulo bloqueado"
        text="Conclua o módulo anterior com pelo menos 70% de aproveitamento para liberar este."
        href={trailHref}
      />
    );
  }

  const questions = mockQuizzes[mod.id] ?? [];
  if (questions.length === 0) {
    return <Notice title="Sem questões" text="Este módulo ainda não tem questões cadastradas." href={trailHref} />;
  }

  return <LessonView key={mod.id} module={mod} questions={questions} />;
}
