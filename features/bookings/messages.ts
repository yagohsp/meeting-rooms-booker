import { formatDuration } from "@/lib/time";
import { formatTime } from "./format";
import type { BookingError } from "./rules";

export function bookingErrorMessage(error: BookingError): string {
  switch (error.code) {
    case "INVALID_RANGE":
      return "O horário de término deve ser depois do início.";
    case "IN_THE_PAST":
      return "Não é possível reservar no passado.";
    case "TOO_SHORT":
      return `A reserva deve ter no mínimo ${formatDuration(error.minMinutes)}.`;
    case "TOO_LONG":
      return `Nesta sala, a reserva deve ter no máximo ${formatDuration(error.maxMinutes)}.`;
    case "OUTSIDE_BUSINESS_HOURS":
      return "Reservas só podem ser feitas em dias úteis, das 08h às 20h.";
    case "OVERLAP":
      return `A sala já está reservada das ${formatTime(error.conflict.startsAt)} às ${formatTime(error.conflict.endsAt)}.`;
  }
}
