/**
 * Ícones do EngAcademy, em SVG.
 * São decorativos: o texto ao lado sempre diz o que o ícone representa.
 */

type IconProps = { className?: string };

export function FlameIcon({ className, flicker = true }: IconProps & { flicker?: boolean }) {
  return (
    <svg className={className} width="52" height="60" viewBox="0 0 52 60" aria-hidden="true">
      <g className={flicker ? "anim-flicker" : undefined}>
        <path
          d="M26 4 C 30 16, 46 22, 46 38 C 46 50, 37 57, 26 57 C 15 57, 6 50, 6 38 C 6 28, 13 22, 16 14 C 18 22, 22 24, 24 22 C 26 16, 24 10, 26 4 Z"
          className="fill-flame stroke-flame-ink"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M26 30 C 29 36, 35 39, 35 46 C 35 51, 31 54, 26 54 C 21 54, 17 51, 17 46 C 17 41, 21 38, 22 34 C 24 38, 25 36, 26 30 Z"
          className="fill-flame-core"
        />
      </g>
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} width="48" height="58" viewBox="0 0 48 58" aria-hidden="true">
      <path
        d="M30 3 L8 33 L22 33 L17 55 L41 23 L26 23 Z"
        className="fill-gold stroke-gold-deep"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LevelBadge({ level, className }: IconProps & { level: number }) {
  return (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 4 L56 17 L56 47 L32 60 L8 47 L8 17 Z"
        className="fill-purple stroke-purple-deep"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 11 L50 21 L50 43 L32 53 L14 43 L14 21 Z"
        fill="none"
        className="stroke-purple-soft"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text x="32" y="41" textAnchor="middle" fontWeight="800" fontSize="24" className="fill-white">
        {level}
      </text>
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M8 18 L14.5 24.5 L26 11" fill="none" className="stroke-white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <path
        d="M17 4 L21 13 L30.5 13.8 L23.3 20 L25.5 29.5 L17 24.5 L8.5 29.5 L10.7 20 L3.5 13.8 L13 13 Z"
        className="fill-white stroke-white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <rect x="6.5" y="13" width="17" height="12" rx="3" fill="currentColor" />
      <path d="M10 13 V10 a5 5 0 0 1 10 0 V13" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- navegação ---------- */

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 13 L14 4 L24 13 V23 a1.5 1.5 0 0 1 -1.5 1.5 H17 V17 H11 V24.5 H5.5 A1.5 1.5 0 0 1 4 23 Z" fill="currentColor" />
    </svg>
  );
}

export function MathIcon({ className }: IconProps) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect x="3.5" y="3.5" width="21" height="21" rx="5" fill="currentColor" />
      <path d="M8 10 H13 M10.5 7.5 V12.5 M15.5 10 H20.5 M8 18.5 L12.5 23 M12.5 18.5 L8 23 M15.5 18 H20.5 M15.5 21.5 H20.5" className="stroke-white" strokeWidth="2" strokeLinecap="round" transform="translate(0 -1.5)" />
    </svg>
  );
}

export function PhysicsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <ellipse cx="14" cy="14" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="14" cy="14" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" transform="rotate(60 14 14)" />
      <ellipse cx="14" cy="14" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" transform="rotate(-60 14 14)" />
      <circle cx="14" cy="14" r="2.8" fill="currentColor" />
    </svg>
  );
}
