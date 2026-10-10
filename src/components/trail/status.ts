import { MIN_APPROVAL_SCORE } from "@/config/gamification";
import { LearningModule } from "@/types";

/** Estado visual de um módulo, derivado do progresso já registrado no contexto. */
export type ModuleStatus = "done" | "current" | "locked";

export function statusOf(mod: LearningModule): ModuleStatus {
  if (mod.progress >= MIN_APPROVAL_SCORE) return "done";
  return mod.isUnlocked ? "current" : "locked";
}

/** Rótulo textual do estado (RNF-004: o estado nunca é comunicado só pela cor). */
export function statusLabel(mod: LearningModule): string {
  const status = statusOf(mod);
  if (status === "done") return "Concluído";
  if (status === "locked") return "Bloqueado";
  return mod.progress > 0 ? `Retomar · ${mod.progress}%` : "Disponível";
}
