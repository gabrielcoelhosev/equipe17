import { prisma } from "../../lib/prisma.js";
import type { CreateCatalogItemInput } from "./catalog.schema.js";

export class CatalogService {
  async listSubjects(userId: number) {
    return prisma.studySubject.findMany({
      where: { user_id: userId },
      orderBy: { name: "asc" },
    });
  }

  async createSubject(userId: number, data: CreateCatalogItemInput) {
    return prisma.studySubject.upsert({
      where: {
        user_id_name: {
          user_id: userId,
          name: data.name,
        },
      },
      update: {},
      create: {
        user_id: userId,
        name: data.name,
      },
    });
  }

  async listTypes(userId: number) {
    return prisma.studyMaterialType.findMany({
      where: { user_id: userId },
      orderBy: { name: "asc" },
    });
  }

  async createType(userId: number, data: CreateCatalogItemInput) {
    return prisma.studyMaterialType.upsert({
      where: {
        user_id_name: {
          user_id: userId,
          name: data.name,
        },
      },
      update: {},
      create: {
        user_id: userId,
        name: data.name,
      },
    });
  }
}
