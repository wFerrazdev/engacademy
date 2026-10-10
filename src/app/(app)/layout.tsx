import Sidebar from "@/components/Sidebar";

/**
 * Layout das telas de navegação (início e trilhas).
 * A tela de lição fica fora deste grupo e ocupa a tela inteira.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto px-4 pt-6 pb-28 sm:px-6 md:pb-12 lg:px-10">
        {children}
      </main>
    </div>
  );
}
