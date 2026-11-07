import { Button } from "@/components/ui/button";
import { logout } from "../actions";

export function UserMenu({ name }: { name: string }) {
  return (
    <form action={logout} className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">{name}</span>
      <Button type="submit" variant="outline" size="sm">
        Sair
      </Button>
    </form>
  );
}
