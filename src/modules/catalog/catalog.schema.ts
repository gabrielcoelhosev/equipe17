import { z } from "zod";

export const createCatalogItemSchema = z.object({
  name: z.string().trim().min(1, "Nome e obrigatorio"),
});

export type CreateCatalogItemInput = z.infer<typeof createCatalogItemSchema>;
