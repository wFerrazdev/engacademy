/** Posição dos nós e das pedras da trilha em zigue-zague. */

export interface Point {
  x: number;
  y: number;
}

export const TRAIL = {
  /** Distância vertical entre nós. */
  GAP: 190,
  /** Espaço acima do primeiro nó: o anel de progresso (48 px de raio) e uma folga. */
  TOP: 72,
  /** Espaço abaixo do último nó. */
  BOTTOM: 70,
  /** Deslocamentos horizontais do zigue-zague, repetidos em ciclo. */
  OFFSETS: [-110, 100, -70, 60],
  /** Raio livre em volta de cada nó, onde não entram pedras (anel de 48 px + meia pedra). */
  CLEAR: 62,
  /** Distância entre pedras ao longo da curva. */
  STEP: 27,
  /** Quanto a curva em "S" se afasta da reta entre dois nós. */
  BEND: 0.78,
  /** Metade da altura visual do nó: 70 px de face + 6 px de volume. */
  NODE_HALF_HEIGHT: 38,
  /** Largura reservada para o balão ao lado do nó. */
  BUBBLE_WIDTH: 124,
  /** Afastamento do balão em relação à borda do nó. */
  BUBBLE_GAP: 26,
} as const;

/** Fator que encolhe o zigue-zague em telas estreitas. */
export function trailScale(width: number): number {
  return Math.max(0.35, Math.min(1, (width - 260) / 480));
}

export function trailHeight(count: number): number {
  return TRAIL.TOP + Math.max(0, count - 1) * TRAIL.GAP + TRAIL.BOTTOM;
}

export function offsetFor(index: number): number {
  return TRAIL.OFFSETS[index % TRAIL.OFFSETS.length];
}

export function nodeCenters(count: number, width: number): Point[] {
  const k = trailScale(width);
  return Array.from({ length: count }, (_, i) => ({
    x: width / 2 + offsetFor(i) * k,
    y: TRAIL.TOP + i * TRAIL.GAP,
  }));
}

function bezier(a: Point, c1: Point, c2: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  };
}

/**
 * Pedras igualmente espaçadas na curva em "S" entre dois nós, descartando só
 * as que cairiam dentro do raio livre dos próprios nós.
 */
export function stonesBetween(a: Point, b: Point): Point[] {
  const c1 = { x: a.x, y: a.y + TRAIL.GAP * TRAIL.BEND };
  const c2 = { x: b.x, y: b.y - TRAIL.GAP * TRAIL.BEND };

  // Amostra a curva e acumula o comprimento para espaçar as pedras por distância, não por t.
  const SAMPLES = 240;
  const pts: Point[] = [];
  const acc: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = bezier(a, c1, c2, b, i / SAMPLES);
    acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y));
    pts.push(p);
  }

  const total = acc[SAMPLES];
  const stones: Point[] = [];
  let j = 1;
  for (let s = 0; s <= total; s += TRAIL.STEP) {
    while (j < SAMPLES && acc[j] < s) j++;
    const span = acc[j] - acc[j - 1] || 1;
    const f = (s - acc[j - 1]) / span;
    const p = {
      x: pts[j - 1].x + (pts[j].x - pts[j - 1].x) * f,
      y: pts[j - 1].y + (pts[j].y - pts[j - 1].y) * f,
    };
    if (Math.hypot(p.x - a.x, p.y - a.y) < TRAIL.CLEAR) continue;
    if (Math.hypot(p.x - b.x, p.y - b.y) < TRAIL.CLEAR) continue;
    stones.push(p);
  }
  return stones;
}
