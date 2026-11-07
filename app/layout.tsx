import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { UserSwitcher } from "@/components/user-switcher";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reserva de Salas",
  description: "Sistema interno para reservar salas de reunião",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b-2 border-brand-accent px-6 py-3">
          <Link
            href="/"
            className="font-semibold whitespace-nowrap text-primary"
          >
            Reserva de Salas
          </Link>
          <UserSwitcher />
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
