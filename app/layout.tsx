import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { UserMenu } from "@/features/auth/components/user-menu";
import { getCurrentUser } from "@/features/auth/session";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Reserva de Salas", template: "%s | Reserva de Salas" },
  description: "Sistema interno para reservar salas de reunião",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b-4 border-brand-orange bg-brand-navbar px-4 py-4 text-white sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/"
              className="font-semibold whitespace-nowrap text-white"
            >
              Reserva de Salas
            </Link>
            {user && <Navbar />}
          </div>
          {user && <UserMenu name={user.name} />}
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
