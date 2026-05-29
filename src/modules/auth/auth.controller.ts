import type { FastifyReply, FastifyRequest } from "fastify";
import { loginBodySchema, registerBodySchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
    async register(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const body = registerBodySchema.parse(request.body);

        const user = await authService.register(body);

        return reply.status(201).send(user);
    };

    async login(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const body = loginBodySchema.parse(request.body);

        const login = await authService.login(body);

        const token = await reply.jwtSign(
            {
                sub: String(login.id),
            },
            {
                expiresIn: "7d",
            }
        );

        return reply.send({
            user: login,
            token
        });
    };
}
