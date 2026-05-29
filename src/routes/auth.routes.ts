import type { FastifyInstance } from "fastify";
import { AuthController } from "../modules/auth/auth.controller.js";

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {

    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);

}
