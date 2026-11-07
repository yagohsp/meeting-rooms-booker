import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/features/auth/session";
import { CancelBookingButton } from "@/features/bookings/components/cancel-booking-button";
import { formatDate, formatTimeRange } from "@/features/bookings/format";
import {
  BOOKING_HISTORY_LIMIT,
  type BookingListItem,
  listBookingHistory,
  listUpcomingBookings,
} from "@/features/bookings/queries";

export const metadata: Metadata = { title: "Minhas reservas" };

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <MyBookingsLayout>
        <p className="text-muted-foreground">
          Escolha um usuário em <strong>Entrar como</strong>, no topo da página,
          para ver suas reservas.
        </p>
      </MyBookingsLayout>
    );
  }

  const now = new Date();
  const [upcoming, history] = await Promise.all([
    listUpcomingBookings(user.id, now),
    listBookingHistory(user.id, now),
  ]);

  return (
    <MyBookingsLayout>
      <section
        aria-labelledby="upcoming-heading"
        className="flex flex-col gap-3"
      >
        <h2 id="upcoming-heading" className="text-lg font-semibold">
          Próximas
        </h2>
        {upcoming.length > 0 ? (
          <ul className="flex flex-col divide-y rounded-lg border">
            {upcoming.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                action={
                  booking.startsAt > now ? (
                    <CancelBookingButton bookingId={booking.id} />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Em andamento
                    </span>
                  )
                }
              />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Nenhuma reserva futura.{" "}
            <Link
              href="/salas"
              className="text-primary underline-offset-4 hover:underline"
            >
              Reservar uma sala
            </Link>
          </p>
        )}
      </section>

      {history.length > 0 && (
        <section
          aria-labelledby="history-heading"
          className="flex flex-col gap-3"
        >
          <h2 id="history-heading" className="text-lg font-semibold">
            Anteriores e canceladas
          </h2>
          {history.length === BOOKING_HISTORY_LIMIT && (
            <p className="text-sm text-muted-foreground">
              Mostrando as {BOOKING_HISTORY_LIMIT} mais recentes.
            </p>
          )}
          <ul className="flex flex-col divide-y rounded-lg border text-muted-foreground">
            {history.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                action={
                  <span className="text-sm">
                    {booking.cancelledAt ? "Cancelada" : "Concluída"}
                  </span>
                }
              />
            ))}
          </ul>
        </section>
      )}
    </MyBookingsLayout>
  );
}

function BookingRow({
  booking,
  action,
}: {
  booking: BookingListItem;
  action: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="font-medium text-foreground">{booking.room.name}</p>
        <p className="text-sm">
          {formatDate(booking.startsAt)},{" "}
          {formatTimeRange(booking.startsAt, booking.endsAt)}
        </p>
      </div>
      {action}
    </li>
  );
}

function MyBookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Minhas reservas</h1>
      {children}
    </div>
  );
}
