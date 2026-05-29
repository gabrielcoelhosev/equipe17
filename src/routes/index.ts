import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { catalogRoutes } from "./catalog.routes.js";
import { materialsRoutes } from "./materials.routes.js";

export async function routes(fastify: FastifyInstance) {

    fastify.get('/check', async () => {
        return { data: 'Api gbriel online!' }
    });

    fastify.register(authRoutes, {prefix: '/auth'});
    fastify.register(catalogRoutes, {prefix: '/catalog'});
    fastify.register(materialsRoutes, {prefix: '/materials'});

}
