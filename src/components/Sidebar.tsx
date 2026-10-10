"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MathIcon, PhysicsIcon } from "@/components/icons";

const ITEMS = [
  { href: "/", label: "Início", Icon: HomeIcon },
  { href: "/trilhas/matematica", label: "Matemática", Icon: MathIcon },
  { href: "/trilhas/fisica", label: "Física", Icon: PhysicsIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Barra lateral (desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-8 border-r-2 border-line bg-surface px-4 py-7">
        <span className="px-3 text-h2 font-extrabold tracking-tight text-purple">EngAcademy</span>
        <nav className="flex flex-col gap-2" aria-label="Navegação principal">
          {ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center gap-4 rounded-btn border-2 px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-[var(--d-fast)] ease-out focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-purple ${
                  active
                    ? "border-purple-soft bg-purple-wash text-purple"
                    : "border-transparent text-ink-soft hover:bg-bg"
                }`}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Navegação inferior (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-stretch justify-around border-t-2 border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Navegação principal"
      >
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-cap font-bold transition-colors duration-[var(--d-fast)] ease-out focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-purple ${
                active ? "text-purple" : "text-ink-soft"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
