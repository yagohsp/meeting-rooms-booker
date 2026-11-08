import { z } from "zod";
import { MAX_CAPACITY, MAX_NAME_LENGTH } from "./limits";

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
  resourceIds: z.array(z.string()).transform((ids) => [...new Set(ids)]),
});

export type RoomInput = z.input<typeof roomInputSchema>;
