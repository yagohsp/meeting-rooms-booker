import { loginAs } from "@/app/actions/session";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function UserSwitcher() {
  const [users, current] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    getCurrentUser(),
  ]);

  return (
    <form action={loginAs} className="flex items-center gap-2 text-sm">
      <label
        htmlFor="userId"
        className="whitespace-nowrap text-muted-foreground"
      >
        Entrar como
      </label>
      <NativeSelect id="userId" name="userId" defaultValue={current?.id ?? ""}>
        <NativeSelectOption value="">Ninguém</NativeSelectOption>
        {users.map((user) => (
          <NativeSelectOption key={user.id} value={user.id}>
            {user.name}
            {user.role === "ADMIN" ? " (admin)" : ""}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <Button type="submit">Trocar</Button>
    </form>
  );
}
