import "server-only";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export function findOverlappingBookings(
  db: Prisma.TransactionClient,
  roomId: string,
  startsAt: Date,
  endsAt: Date,
) {
  return db.booking.findMany({
    where: {
      roomId,
      cancelledAt: null,
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
    select: { startsAt: true, endsAt: true },
    orderBy: { startsAt: "asc" },
  });
}

export const BOOKING_HISTORY_LIMIT = 20;

const bookingListSelect = {
  id: true,
  startsAt: true,
  endsAt: true,
  cancelledAt: true,
  room: { select: { name: true } },
} satisfies Prisma.BookingSelect;

export function listUpcomingBookings(userId: string, now: Date) {
  return prisma.booking.findMany({
    where: { userId, cancelledAt: null, endsAt: { gt: now } },
    select: bookingListSelect,
    orderBy: { startsAt: "asc" },
  });
}

export function listBookingHistory(userId: string, now: Date) {
  return prisma.booking.findMany({
    where: {
      userId,
      OR: [{ cancelledAt: { not: null } }, { endsAt: { lte: now } }],
    },
    select: bookingListSelect,
    orderBy: { startsAt: "desc" },
    take: BOOKING_HISTORY_LIMIT,
  });
}
