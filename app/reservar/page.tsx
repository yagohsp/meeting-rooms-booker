import type { Metadata } from "next";
import { Eyebrow } from "@/components/eyebrow";
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
  const rooms = await listRoomOptions();
  const roomId = rooms.find((room) => room.id === sala)?.id;
  const today = todayInSaoPaulo();
  const date = z.iso.date().safeParse(data).success ? (data as string) : today;
  const day = {
    startsAt: zonedDateTimeToUtc(date, "00:00"),
    endsAt: zonedDateTimeToUtc(addDays(date, 1), "00:00"),
  };
  const bookings = roomId
    ? await listRoomBookingsBetween(roomId, day.startsAt, day.endsAt)
    : [];

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      {origem === "salas" && <BackToRooms />}
      <div className="flex flex-col gap-2">
        <Eyebrow>Nova reserva</Eyebrow>
        <h1 className="text-3xl font-medium tracking-tight">Reservar sala</h1>
      </div>
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
