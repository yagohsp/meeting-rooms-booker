"use server";

import { z } from "zod";
import { getCurrentUser } from "@/features/auth/session";
import { prisma } from "@/lib/db";
import { formString } from "@/lib/forms";
import { formatDate, formatTimeRange } from "./format";
import { bookingErrorMessage } from "./messages";
import { findOverlappingBookings } from "./queries";
import { checkBookingTimes, checkOverlap } from "./rules";
import { bookingInputSchema, type BookingInput } from "./schemas";

export type FormErrors = Partial<Record<keyof BookingInput | "form", string[]>>;

export type CreateBookingState =
  | { status: "idle" }
  | { status: "error"; values: BookingInput; errors: FormErrors }
  | { status: "success"; message: string };

export async function createBooking(
  _previous: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const values: BookingInput = {
    roomId: formString(formData, "roomId"),
    date: formString(formData, "date"),
    start: formString(formData, "start"),
    end: formString(formData, "end"),
  };
  const fail = (errors: FormErrors): CreateBookingState => ({
    status: "error",
    values,
    errors,
  });

  const user = await getCurrentUser();
  if (!user) return fail({ form: ["Entre como um usuário para reservar."] });

  const parsed = bookingInputSchema.safeParse(values);
  if (!parsed.success) {
    return fail(z.flattenError(parsed.error).fieldErrors);
  }
  const { roomId, startsAt, endsAt } = parsed.data;
  const requested = { startsAt, endsAt };

  const timeErrors = checkBookingTimes(requested, new Date());
  if (timeErrors.length > 0) {
    return fail({ form: timeErrors.map(bookingErrorMessage) });
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: roomId },
        select: { name: true },
      });
      if (!room) return fail({ roomId: ["Sala não encontrada."] });

      const conflicts = checkOverlap(
        requested,
        await findOverlappingBookings(tx, roomId, startsAt, endsAt),
      );
      if (conflicts.length > 0) {
        return fail({ form: conflicts.map(bookingErrorMessage) });
      }

      await tx.booking.create({
        data: { roomId, userId: user.id, startsAt, endsAt },
      });

      return {
        status: "success",
        message: `${room.name} reservada para ${formatDate(startsAt)}, ${formatTimeRange(startsAt, endsAt)}.`,
      };
    });
  } catch (error) {
    console.error("Failed to create booking", error);
    return fail({
      form: ["Não foi possível concluir a reserva. Tente novamente."],
    });
  }
}
