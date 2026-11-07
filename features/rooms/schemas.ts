import { z } from "zod";

export const MAX_CAPACITY = 500;

export const roomInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),
  capacity: z
    .string()
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
