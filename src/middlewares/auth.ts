import type { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {

        if(request.url.startsWith("/check") || request.url.startsWith("/auth") || request.url.startsWith("/docs") || request.url.startsWith("/openapi.json") || request.url.startsWith("/uploads")) return;

        await request.jwtVerify();
    } catch {
        return reply.status(401).send({
            message: 'Token inválido ou ausente'
        })
    }
}
