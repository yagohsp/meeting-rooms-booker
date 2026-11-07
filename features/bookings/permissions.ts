type CancelableBooking = {
  userId: string;
  startsAt: Date;
  cancelledAt: Date | null;
};

export type CancelDecision =
  | { ok: true }
  | {
      ok: false;
      reason: "NOT_FOUND" | "ALREADY_CANCELLED" | "ALREADY_STARTED";
    };

export function canCancelBooking(
  user: { id: string },
  booking: CancelableBooking | null,
  now: Date,
): CancelDecision {
  if (!booking || booking.userId !== user.id) {
    return { ok: false, reason: "NOT_FOUND" };
  }
  if (booking.cancelledAt) return { ok: false, reason: "ALREADY_CANCELLED" };
  if (booking.startsAt <= now) return { ok: false, reason: "ALREADY_STARTED" };
  return { ok: true };
}
