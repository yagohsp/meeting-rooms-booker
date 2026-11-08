"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formString } from "@/lib/forms";
import { SESSION_COOKIE } from "@/features/auth/session";

export async function loginAs(formData: FormData) {
  const userId = formString(formData, "userId");
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      })
    : null;
  if (!user) redirect("/entrar");

  (await cookies()).set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  redirect("/salas");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/entrar");
}
