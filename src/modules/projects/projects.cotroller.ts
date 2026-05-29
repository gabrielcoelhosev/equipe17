import type { FastifyRequest, FastifyReply } from "fastify"
import { ProjectsService } from "./projects.service.js"
import { createProjectSchema } from "./projects.schema.js";

const projectsService = new ProjectsService();

export class ProjectsController {
    async create(
        request: FastifyRequest,
        resply: FastifyReply
    ) {

        const body = createProjectSchema.parse(request.body);

        const project = await projectsService.create(body)
    }
}
