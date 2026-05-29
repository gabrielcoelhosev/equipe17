import z from 'zod';

export const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6)
}); //Aqui criei uma validacao que vai ser usado no parse

export type RegisterBody = z.infer<typeof registerBodySchema>; // Aqui criei um tipo TypeScript baseado no schema acima

export const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export type LoginBody = z.infer<typeof loginBodySchema>;