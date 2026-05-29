import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string().min(10),
    DATABASE_URL: z.string()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) throw new Error('Erro ao validar variáveis de ambiente');

export const env = _env.data;