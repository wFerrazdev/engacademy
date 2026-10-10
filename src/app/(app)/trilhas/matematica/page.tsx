"use client";

import { useStudentContext } from '@/context/StudentContext';
import TrilhaVertical from '@/components/TrilhaVertical';

export default function MatematicaPage() {
  const { mathModules } = useStudentContext();

  return (
    <TrilhaVertical
      label="Trilha de Matemática"
      title="Cálculo I, passo a passo"
      modules={mathModules}
    />
  );
}
