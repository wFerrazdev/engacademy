import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { StudentProvider } from "@/context/StudentContext";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EngAcademy | Nivelamento em Matemática e Física",
  description: "Plataforma gamificada para o nivelamento em Matemática e Física de ingressantes em Engenharia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">
        <StudentProvider>{children}</StudentProvider>
      </body>
    </html>
  );
}
