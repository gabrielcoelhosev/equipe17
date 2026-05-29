import { prisma } from "../../lib/prisma.js";
import type { CreateProjectInput } from "./projects.schema.js";

export class ProjectsService {
    async create(data: CreateProjectInput) {

        const {
            title,
            description,
            links,
            short_description,
            stack_ids,
            thumbail_url
        } = data;

        const project = await prisma.project.create({
            data: {
                title,
                short_description,
                description,
                thumbail_url: thumbail_url ?? null,
                stack: {
                    create: stack_ids.map((stackId) => ({
                        stack: {
                            connect: {
                                id: stackId
                            }
                        }
                    }))
                },
                link: {
                    create: links.map((link) => ({
                        type: link.type,
                        label: link.label,
                        url: link.url
                    }))
                }
            }
        })

        return project;
    }
}
