import { loginAs } from "@/app/actions/session";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function UserSwitcher() {
  const [users, current] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    getCurrentUser(),
  ]);

  return (
    <form action={loginAs} className="flex items-center gap-2 text-sm">
      <label htmlFor="userId" className="text-zinc-500">
        Entrar como
      </label>
      <select
        id="userId"
        name="userId"
        defaultValue={current?.id ?? ""}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1"
      >
        <option value="">Ninguém</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
            {user.role === "ADMIN" ? " (admin)" : ""}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Trocar
      </button>
    </form>
  );
}
