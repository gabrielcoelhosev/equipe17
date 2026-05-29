import type { FastifyInstance } from "fastify";
import { MaterialsController } from "../modules/materials/materials.controller.js";

const materialsController = new MaterialsController();

export async function materialsRoutes(fastify: FastifyInstance) {
  fastify.post("/", materialsController.create);
  fastify.get("/", materialsController.search);
  fastify.delete("/:id", materialsController.delete);
}
