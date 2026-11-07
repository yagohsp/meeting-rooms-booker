import type { Metadata } from "next";
import { Eyebrow } from "@/components/eyebrow";
import { requireUser } from "@/features/auth/session";
import { BookingForm } from "@/features/bookings/components/booking-form";
import { todayInSaoPaulo } from "@/lib/time";
import { listRoomOptions } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Reservar" };

export default async function BookingPage({
  searchParams,
}: PageProps<"/reservar">) {
  await requireUser();
  const { sala } = await searchParams;
  const rooms = await listRoomOptions();
  const defaultRoomId = rooms.find((room) => room.id === sala)?.id;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Eyebrow>Nova reserva</Eyebrow>
        <h1 className="text-3xl font-medium tracking-tight">Reservar sala</h1>
      </div>
      <BookingForm
        rooms={rooms}
        defaultRoomId={defaultRoomId}
        today={todayInSaoPaulo()}
      />
    </div>
  );
}
