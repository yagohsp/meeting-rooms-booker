import type { Metadata } from "next";
import Link from "next/link";
import { UserSwitcher } from "@/components/user-switcher";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Reserva de Salas", template: "%s | Reserva de Salas" },
  description: "Sistema interno para reservar salas de reunião",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b-2 border-brand-accent px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-semibold whitespace-nowrap text-primary"
          >
            Reserva de Salas
          </Link>
          <UserSwitcher />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
