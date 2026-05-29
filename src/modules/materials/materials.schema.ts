import { z } from "zod";

const base64FileSchema = z.object({
  fileName: z.string().min(1).optional(),
  mimeType: z.string().min(1).optional(),
  base64: z.string().min(1).optional(),
});

export const createMaterialSchema = z
  .object({
    subject: z.string().trim().min(1, "Materia e obrigatoria"),
    materialType: z.string().trim().min(1, "Tipo e obrigatorio"),
    contextText: z
      .string()
      .trim()
      .min(8, "Explique o contexto em pelo menos uma linha"),
    noteText: z.string().trim().optional(),
    file: base64FileSchema.optional(),
    audio: base64FileSchema.optional(),
  })
  .refine((data) => data.noteText || data.file?.base64, {
    message: "Envie um arquivo ou escreva uma frase solta",
    path: ["file"],
  });

export const searchMaterialsSchema = z.object({
  q: z.string().trim().optional().default(""),
  subject: z.string().trim().optional(),
  materialType: z.string().trim().optional(),
});

export const materialParamsSchema = z.object({
  id: z.coerce.number().int().positive("Material invalido"),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type SearchMaterialsInput = z.infer<typeof searchMaterialsSchema>;
export type MaterialParamsInput = z.infer<typeof materialParamsSchema>;
