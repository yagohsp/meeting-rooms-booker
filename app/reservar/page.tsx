import type { Metadata } from "next";
import { getCurrentUser } from "@/features/auth/session";
import { BookingForm } from "@/features/bookings/components/booking-form";
import { todayInSaoPaulo } from "@/lib/time";
import { listRoomOptions } from "@/features/rooms/queries";

export const metadata: Metadata = { title: "Reservar" };

export default async function BookingPage({
  searchParams,
}: PageProps<"/reservar">) {
  const [{ sala }, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    return (
      <BookingLayout>
        <p className="text-muted-foreground">
          Escolha um usuário em <strong>Entrar como</strong>, no topo da página,
          para fazer uma reserva.
        </p>
      </BookingLayout>
    );
  }

  const rooms = await listRoomOptions();
  const defaultRoomId = rooms.find((room) => room.id === sala)?.id;

  return (
    <BookingLayout>
      <BookingForm
        rooms={rooms}
        defaultRoomId={defaultRoomId}
        today={todayInSaoPaulo()}
      />
    </BookingLayout>
  );
}

function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-2xl font-semibold">Reservar sala</h1>
      {children}
    </div>
  );
}
