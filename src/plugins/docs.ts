import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

async function docsPlugin(app: FastifyInstance) {
    await app.register(swagger, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "Minha API",
                description: "Documentação da API",
                version: "1.0.0",
            },
            servers: [
                {
                    url: "http://localhost:3333",
                    description: "Servidor local",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
    });

    app.get("/openapi.json", async () => {
        return app.swagger();
    });

    await app.register(scalarApiReference, {
        routePrefix: "/docs",
        configuration: {
            spec: {
                url: "/openapi.json",
            },
            theme: "purple",
            layout: "modern",
        },
    });
}

export default fp(docsPlugin);