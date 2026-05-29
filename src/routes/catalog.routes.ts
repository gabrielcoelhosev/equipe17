import type { FastifyInstance } from "fastify";
import { CatalogController } from "../modules/catalog/catalog.controller.js";

const catalogController = new CatalogController();

export async function catalogRoutes(fastify: FastifyInstance) {
  fastify.get("/subjects", catalogController.listSubjects);
  fastify.post("/subjects", catalogController.createSubject);
  fastify.get("/types", catalogController.listTypes);
  fastify.post("/types", catalogController.createType);
}
