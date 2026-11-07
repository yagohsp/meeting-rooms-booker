"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fontVariables } from "./fonts";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR" className={`${fontVariables} antialiased`}>
      <body className="flex min-h-screen items-center justify-center px-4">
        <title>Erro | Reserva de Salas</title>
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Algo deu errado</h1>
          <p className="text-muted-foreground">
            O sistema está indisponível no momento. Tente novamente em
            instantes.
          </p>
          <Button onClick={() => retry()}>Tentar novamente</Button>
        </div>
      </body>
    </html>
  );
}
