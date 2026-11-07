import "server-only";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "uid";

export const getCurrentUser = cache(async () => {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true },
  });
});

export function isAdmin(user: { role: string } | null) {
  return user?.role === "ADMIN";
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) notFound();
  return user;
}
