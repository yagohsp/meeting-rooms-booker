import { formatTime } from "./format";
import type { BookingError } from "./rules";

export function bookingErrorMessage(error: BookingError): string {
  switch (error.code) {
    case "INVALID_RANGE":
      return "O horário de término deve ser depois do início.";
    case "IN_THE_PAST":
      return "Não é possível reservar no passado.";
    case "TOO_SHORT":
      return `A reserva deve ter no mínimo ${error.minMinutes} minutos.`;
    case "TOO_LONG":
      return `A reserva deve ter no máximo ${error.maxMinutes / 60} horas.`;
    case "OVERLAP":
      return `A sala já está reservada das ${formatTime(error.conflict.startsAt)} às ${formatTime(error.conflict.endsAt)}.`;
  }
}
