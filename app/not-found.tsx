import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-medium tracking-tight">
        Página não encontrada
      </h1>
      <p className="text-muted-foreground">
        O endereço não existe ou você não tem acesso a ele.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        Voltar ao início
      </Link>
    </div>
  );
}
