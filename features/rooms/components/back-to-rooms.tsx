"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackToRooms() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 self-start"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/salas");
      }}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      Voltar para salas
    </Button>
  );
}
