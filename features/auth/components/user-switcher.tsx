import { loginAs } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getCurrentUser } from "@/features/auth/session";
import { prisma } from "@/lib/db";

export async function UserSwitcher() {
  const [users, current] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    getCurrentUser(),
  ]);

  return (
    <form
      action={loginAs}
      className="flex w-full items-center gap-2 text-sm sm:w-auto"
    >
      <label
        htmlFor="userId"
        className="whitespace-nowrap text-muted-foreground"
      >
        Entrar como
      </label>
      <NativeSelect
        id="userId"
        name="userId"
        defaultValue={current?.id ?? ""}
        className="min-w-0 flex-1 sm:w-48 sm:flex-none"
      >
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
