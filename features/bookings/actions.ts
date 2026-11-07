"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/features/auth/session";
import { prisma } from "@/lib/db";
import { formString } from "@/lib/forms";
import { formatDate, formatTimeRange } from "./format";
import { bookingErrorMessage } from "./messages";
import { canCancelBooking } from "./permissions";
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

export type CancelBookingState = { error?: string };

const CANCEL_ERRORS = {
  NOT_FOUND: "Reserva não encontrada.",
  ALREADY_CANCELLED: "Esta reserva já foi cancelada.",
  ALREADY_STARTED: "Não é possível cancelar uma reserva que já começou.",
} as const;

export async function cancelBooking(
  _previous: CancelBookingState,
  formData: FormData,
): Promise<CancelBookingState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Entre como um usuário para cancelar." };

  const bookingId = formString(formData, "bookingId");
  const findBooking = () =>
    prisma.booking.findUnique({
      where: { id: bookingId },
      select: { userId: true, startsAt: true, cancelledAt: true },
    });

  const now = new Date();
  const decision = canCancelBooking(user, await findBooking(), now);
  if (!decision.ok) return { error: CANCEL_ERRORS[decision.reason] };

  const { count } = await prisma.booking.updateMany({
    where: {
      id: bookingId,
      userId: user.id,
      cancelledAt: null,
      startsAt: { gt: now },
    },
    data: { cancelledAt: now },
  });
  if (count === 0) {
    const current = canCancelBooking(user, await findBooking(), new Date());
    return {
      error: CANCEL_ERRORS[current.ok ? "ALREADY_CANCELLED" : current.reason],
    };
  }

  revalidatePath("/minhas-reservas");
  return {};
}
