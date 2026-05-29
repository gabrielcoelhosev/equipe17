import type { FastifyReply, FastifyRequest } from "fastify";
import { createCatalogItemSchema } from "./catalog.schema.js";
import { CatalogService } from "./catalog.service.js";

const catalogService = new CatalogService();

function getUserId(request: FastifyRequest) {
  const user = request.user as { sub?: string };
  const userId = Number(user?.sub);

  if (!Number.isInteger(userId)) {
    throw new Error("Usuario invalido");
  }

  return userId;
}

export class CatalogController {
  async listSubjects(request: FastifyRequest, reply: FastifyReply) {
    const subjects = await catalogService.listSubjects(getUserId(request));
    return reply.send(subjects);
  }

  async createSubject(request: FastifyRequest, reply: FastifyReply) {
    const body = createCatalogItemSchema.parse(request.body);
    const subject = await catalogService.createSubject(getUserId(request), body);
    return reply.status(201).send(subject);
  }

  async listTypes(request: FastifyRequest, reply: FastifyReply) {
    const types = await catalogService.listTypes(getUserId(request));
    return reply.send(types);
  }

  async createType(request: FastifyRequest, reply: FastifyReply) {
    const body = createCatalogItemSchema.parse(request.body);
    const type = await catalogService.createType(getUserId(request), body);
    return reply.status(201).send(type);
  }
}
