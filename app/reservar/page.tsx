import type { Metadata } from "next";
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
      <h1 className="text-2xl font-semibold">Reservar sala</h1>
      <BookingForm
        rooms={rooms}
        defaultRoomId={defaultRoomId}
        today={todayInSaoPaulo()}
      />
    </div>
  );
}
