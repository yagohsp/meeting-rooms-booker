import { z } from "zod";
import { zonedDateTimeToUtc } from "@/lib/time";

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe um horário válido.");

export const bookingInputSchema = z
  .object({
    roomId: z.string().min(1, "Escolha uma sala."),
    date: z.iso.date("Informe uma data válida."),
    start: time,
    end: time,
  })
  .transform(({ roomId, date, start, end }) => ({
    roomId,
    startsAt: zonedDateTimeToUtc(date, start),
    endsAt: zonedDateTimeToUtc(date, end),
  }));

export type BookingInput = z.input<typeof bookingInputSchema>;
