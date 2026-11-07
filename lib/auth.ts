import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// No real login (allowed by the challenge): the cookie only identifies the
// user picked in "entrar como". The role always comes from the database.
export const SESSION_COOKIE = "uid";

export async function getCurrentUser() {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true },
  });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}
