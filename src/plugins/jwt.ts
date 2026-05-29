import fp from 'fastify-plugin'; //Utilizo o fp para evitar erros de encapsulamento
import jwt from '@fastify/jwt';
import { env } from '../env/index.js';

export async function jwtplugin(app: any) {
    await app.register(jwt, {
        secret: env.JWT_SECRET
    });
}

export default fp(jwtplugin);