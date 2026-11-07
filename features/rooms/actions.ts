"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser, isAdmin } from "@/features/auth/session";
import { prisma } from "@/lib/db";
import { formString } from "@/lib/forms";
import { Prisma } from "@/lib/generated/prisma/client";
import { roomInputSchema, type RoomInput } from "./schemas";

export type RoomFormErrors = Partial<
  Record<keyof RoomInput | "form", string[]>
>;

export type SaveRoomState =
  | { status: "idle" }
  | { status: "error"; values: RoomInput; errors: RoomFormErrors };

export async function saveRoom(
  roomId: string | null,
  _previous: SaveRoomState,
  formData: FormData,
): Promise<SaveRoomState> {
  const values: RoomInput = {
    name: formString(formData, "name"),
    capacity: formString(formData, "capacity"),
    resourceIds: formData
      .getAll("resourceIds")
      .filter((value): value is string => typeof value === "string"),
  };
  const fail = (errors: RoomFormErrors): SaveRoomState => ({
    status: "error",
    values,
    errors,
  });

  if (!isAdmin(await getCurrentUser())) {
    return fail({ form: ["Apenas administradores podem gerenciar salas."] });
  }

  const parsed = roomInputSchema.safeParse(values);
  if (!parsed.success) return fail(z.flattenError(parsed.error).fieldErrors);
  const { name, capacity, resourceIds } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const known = await tx.resource.findMany({
        where: { id: { in: resourceIds } },
        select: { id: true },
      });
      const resources = known.map(({ id }) => ({ resourceId: id }));

      if (roomId) {
        await tx.room.update({
          where: { id: roomId },
          data: {
            name,
            capacity,
            resources: { deleteMany: {}, create: resources },
          },
        });
      } else {
        await tx.room.create({
          data: { name, capacity, resources: { create: resources } },
        });
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return fail({ name: ["Já existe uma sala com esse nome."] });
      }
      if (error.code === "P2025")
        return fail({ form: ["Sala não encontrada."] });
    }
    console.error("Failed to save room", error);
    return fail({ form: ["Não foi possível salvar a sala. Tente novamente."] });
  }

  revalidatePath("/", "layout");
  redirect("/admin/salas");
}
