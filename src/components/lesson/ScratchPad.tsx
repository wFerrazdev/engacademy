"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Tool = "pen" | "eraser";

interface ScratchPadProps {
  /** Chave do armazenamento local: um rascunho por lição. */
  storageKey: string;
}

const PEN_WIDTH = 2.6;
const ERASER_WIDTH = 22;

/**
 * Folha quadriculada para fazer contas à mão (mouse, caneta ou dedo).
 * O desenho fica salvo no navegador, um por lição.
 */
export default function ScratchPad({ storageKey }: ScratchPadProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [empty, setEmpty] = useState(true);

  const context = () => canvas.current?.getContext("2d") ?? null;

  const save = useCallback(() => {
    const el = canvas.current;
    if (!el) return;
    try {
      window.localStorage.setItem(storageKey, el.toDataURL("image/png"));
    } catch {
      // armazenamento cheio ou bloqueado: o rascunho continua na tela, só não é guardado
    }
  }, [storageKey]);

  // Ajusta a resolução do canvas ao tamanho do painel, preservando o que já foi desenhado.
  useEffect(() => {
    const box = wrapper.current;
    const el = canvas.current;
    if (!box || !el) return;

    const fit = () => {
      const rect = box.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (el.width === width && el.height === height) return;

      const snapshot = document.createElement("canvas");
      snapshot.width = el.width;
      snapshot.height = el.height;
      if (el.width && el.height) snapshot.getContext("2d")?.drawImage(el, 0, 0);

      el.width = width;
      el.height = height;
      const ctx = el.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (snapshot.width && snapshot.height) ctx.drawImage(snapshot, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Recupera o rascunho salvo desta lição.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(storageKey);
    } catch {
      stored = null;
    }
    if (!stored) return;
    const image = new Image();
    image.onload = () => {
      const ctx = context();
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(image, 0, 0);
      ctx.restore();
      setEmpty(false);
    };
    image.src = stored;
  }, [storageKey]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = point(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    setEmpty(false);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = context();
    if (!drawing.current || !last.current || !ctx) return;
    const p = point(event);
    ctx.globalCompositeOperation = tool === "pen" ? "source-over" : "destination-out";
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim();
    ctx.lineWidth = tool === "pen" ? PEN_WIDTH : ERASER_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    save();
  };

  const clear = () => {
    const el = canvas.current;
    const ctx = context();
    if (!el || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, el.width, el.height);
    ctx.restore();
    setEmpty(true);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // nada a remover
    }
  };

  const toolClass = (active: boolean) =>
    `inline-flex min-h-11 items-center gap-1.5 rounded-[10px] border-2 px-3 text-cap font-semibold transition-colors duration-[var(--d-fast)] ease-out focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple ${
      active ? "border-purple bg-purple-wash text-purple" : "border-line bg-surface text-ink-soft hover:bg-bg"
    }`;

  return (
    <section className="card flex min-h-[340px] flex-col overflow-hidden lg:min-h-0" aria-label="Rascunho">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-surface px-3 py-2">
        <span className="label-caps">Rascunho</span>
        <div className="flex gap-2">
          <button type="button" className={toolClass(tool === "pen")} aria-pressed={tool === "pen"} onClick={() => setTool("pen")}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 12 L3 9 L10 2 L12 4 L5 11 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Lápis
          </button>
          <button type="button" className={toolClass(tool === "eraser")} aria-pressed={tool === "eraser"} onClick={() => setTool("eraser")}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5 12 L1.5 8.5 L7.5 2.5 L12 7 L7 12 Z M4 6 L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Borracha
          </button>
          <button type="button" className={toolClass(false)} onClick={clear}>
            Limpar
          </button>
        </div>
      </div>
      <div
        ref={wrapper}
        className="grid-paper relative flex-1 touch-none"
      >
        <canvas
          ref={canvas}
          className={`absolute inset-0 size-full ${tool === "pen" ? "cursor-crosshair" : "cursor-cell"}`}
          aria-label="Área de rascunho para escrever cálculos à mão"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {empty && (
          <span className="pointer-events-none absolute bottom-2 left-3 text-cap font-medium text-ink-soft">
            Escreva aqui com o mouse, a caneta ou o dedo
          </span>
        )}
      </div>
    </section>
  );
}
