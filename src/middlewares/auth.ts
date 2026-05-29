import type { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        const protectedPaths = ["/catalog", "/materials", "/projects"];

        if (!protectedPaths.some((path) => request.url.startsWith(path))) return;

        await request.jwtVerify();
    } catch {
        return reply.status(401).send({
            message: 'Token inválido ou ausente'
        })
    }
}
