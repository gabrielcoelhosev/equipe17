import fastify from "fastify";
import cors from "@fastify/cors";
import { createReadStream } from "node:fs";
import path from "node:path";
import { ZodError } from "zod";
import { routes } from "./routes/index.js";
import { jwtplugin } from "./plugins/jwt.js";
import { authMiddleware } from "./middlewares/auth.js";
import { logger } from "./middlewares/logger.js";
import docsPlugin from "./plugins/docs.js";

export const app = fastify();
app.register(cors, {
    origin: true,
});
app.register(jwtplugin);
app.register(docsPlugin);
app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: "Dados invalidos",
            issues: error.issues,
        });
    }

    const message = error instanceof Error ? error.message : "Erro inesperado";

    return reply.status(400).send({
        message,
    });
});
app.addHook('onRequest', authMiddleware);
app.addHook('onResponse', logger);
app.get("/uploads/:folder/:file", async (request, reply) => {
    const { folder, file } = request.params as { folder: string; file: string };
    const filePath = path.resolve(process.cwd(), "uploads", folder, file);
    const uploadRoot = path.resolve(process.cwd(), "uploads");

    if (!filePath.startsWith(uploadRoot)) {
        return reply.status(400).send({ message: "Arquivo invalido" });
    }

    return reply.send(createReadStream(filePath));
});
app.register(routes);
