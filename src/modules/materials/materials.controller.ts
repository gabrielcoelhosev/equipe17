import type { FastifyReply, FastifyRequest } from "fastify";
import { MaterialsService } from "./materials.service.js";
import { createMaterialSchema, materialParamsSchema, searchMaterialsSchema } from "./materials.schema.js";

const materialsService = new MaterialsService();

function getUserId(request: FastifyRequest) {
  const user = request.user as { sub?: string };
  const userId = Number(user?.sub);

  if (!Number.isInteger(userId)) {
    throw new Error("Usuario invalido");
  }

  return userId;
}

export class MaterialsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createMaterialSchema.parse(request.body);
    const material = await materialsService.create(getUserId(request), body);

    return reply.status(201).send(material);
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    const query = searchMaterialsSchema.parse(request.query);
    const materials = await materialsService.search(getUserId(request), query);

    return reply.send(materials);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = materialParamsSchema.parse(request.params);
    const result = await materialsService.delete(getUserId(request), params.id);

    return reply.send(result);
  }
}
