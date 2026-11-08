import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/features/auth/session";
import { BookingForm } from "@/features/bookings/components/booking-form";
import { BackToRooms } from "@/features/rooms/components/back-to-rooms";
import { z } from "zod";
import { DayOccupancy } from "@/features/bookings/components/day-occupancy";
import { listRoomBookingsBetween } from "@/features/bookings/queries";
import { addDays, todayInSaoPaulo, zonedDateTimeToUtc } from "@/lib/time";
import { listRoomOptions } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Reservar" };

export default async function BookingPage({
  searchParams,
}: PageProps<"/reservar">) {
  await requireUser();
  const { sala, data, origem } = await searchParams;
  const today = todayInSaoPaulo();
  const date = z.iso.date().safeParse(data).success ? (data as string) : today;
  const day = {
    startsAt: zonedDateTimeToUtc(date, "00:00"),
    endsAt: zonedDateTimeToUtc(addDays(date, 1), "00:00"),
  };
  const [rooms, dayBookings] = await Promise.all([
    listRoomOptions(),
    typeof sala === "string"
      ? listRoomBookingsBetween(sala, day.startsAt, day.endsAt)
      : [],
  ]);
  const roomId = rooms.find((room) => room.id === sala)?.id;
  const bookings = roomId ? dayBookings : [];

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      {origem === "salas" && <BackToRooms />}
      <PageHeader eyebrow="Nova reserva" title="Reservar sala" />
      <BookingForm
        rooms={rooms}
        defaultRoomId={roomId}
        defaultDate={date}
        today={today}
        origin={origem === "salas" ? "salas" : undefined}
        occupancy={roomId && <DayOccupancy day={day} bookings={bookings} />}
      />
    </div>
  );
}
