import z from "zod";

export const makeCreditsSchema = z.object({
  credits: z.int().min(1),
  price: z.number().min(1),
  bonus: z.int().min(1).optional(),
});
