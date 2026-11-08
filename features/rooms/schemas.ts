import { z } from "zod";
import { MIN_DURATION_MINUTES } from "@/features/bookings/rules";
import { formatDuration } from "@/lib/time";
import {
  MAX_CAPACITY,
  MAX_MAX_DURATION_MINUTES,
  MAX_NAME_LENGTH,
} from "./limits";

export const roomInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da sala.")
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(
      MAX_NAME_LENGTH,
      `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
    ),
  capacity: z
    .string()
    .min(1, "Informe a capacidade.")
    .regex(/^\d+$/, "Informe um número inteiro.")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(1, "A capacidade mínima é 1 pessoa.")
        .max(MAX_CAPACITY, `A capacidade máxima é ${MAX_CAPACITY} pessoas.`),
    ),
  maxDurationMinutes: z
    .string()
    .min(1, "Informe a duração máxima.")
    .regex(/^\d+$/, "Informe um número inteiro de minutos.")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(
          MIN_DURATION_MINUTES,
          `A duração máxima deve ser de pelo menos ${formatDuration(MIN_DURATION_MINUTES)}.`,
        )
        .max(
          MAX_MAX_DURATION_MINUTES,
          `A duração máxima deve ser de até ${formatDuration(MAX_MAX_DURATION_MINUTES)}.`,
        ),
    ),
  resourceIds: z.array(z.string()).transform((ids) => [...new Set(ids)]),
});

export type RoomInput = z.input<typeof roomInputSchema>;
