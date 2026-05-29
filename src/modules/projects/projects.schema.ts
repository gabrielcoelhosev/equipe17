import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),

  short_description: z
    .string()
    .min(1, "Descrição curta é obrigatória"),

  description: z
    .string()
    .min(1, "Descrição é obrigatória"),

  thumbail_url: z
    .string()
    .url("URL da thumbnail inválida")
    .optional()
    .nullable(),

  stack_ids: z
    .array(z.coerce.number().int().positive())
    .min(1, "Informe pelo menos uma stack"),

  links: z
    .array(
      z.object({
        type: z.enum([
          "FRONTEND",
          "BACKEND",
          "DEMO",
          "FIGMA",
          "DOCS",
          "YOUTUBE",
        ]),
        label: z.string().min(1, "Label do link é obrigatório"),
        url: z.string().url("URL inválida"),
      })
    )
    .optional()
    .default([]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;