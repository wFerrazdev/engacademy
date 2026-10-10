"use client";

import { useStudentContext } from '@/context/StudentContext';
import TrilhaVertical from '@/components/TrilhaVertical';

export default function FisicaPage() {
  const { physicsModules } = useStudentContext();

  return (
    <TrilhaVertical
      label="Trilha de Física"
      title="Física I, passo a passo"
      modules={physicsModules}
    />
  );
}
