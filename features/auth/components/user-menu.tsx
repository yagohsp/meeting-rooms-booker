import { Button } from "@/components/ui/button";
import { logout } from "../actions";

export function UserMenu({ name }: { name: string }) {
  return (
    <form action={logout} className="flex items-center gap-3 text-sm">
      <span className="text-white/80">{name}</span>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        Sair
      </Button>
    </form>
  );
}
