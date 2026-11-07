import type { Metadata } from "next";
import Link from "next/link";
import { UserSwitcher } from "@/components/user-switcher";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reserva de Salas",
  description: "Sistema interno para reservar salas de reunião",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
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
