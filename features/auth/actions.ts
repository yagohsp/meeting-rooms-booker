"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { formString } from "@/lib/forms";
import { SESSION_COOKIE } from "@/features/auth/session";

export async function loginAs(formData: FormData) {
  const userId = formString(formData, "userId");
  const store = await cookies();

  if (!userId) {
    store.delete(SESSION_COOKIE);
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");
    store.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  revalidatePath("/", "layout");
}
