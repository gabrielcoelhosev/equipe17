import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../../lib/prisma.js";
import type { CreateMaterialInput, SearchMaterialsInput } from "./materials.schema.js";

type StoredFile = {
  url: string;
  name: string;
  mime: string;
};

type Base64File = {
  fileName?: string | undefined;
  mimeType?: string | undefined;
  base64?: string | undefined;
};

const uploadRoot = path.resolve(process.cwd(), "uploads");

function extensionFromMime(mime?: string) {
  if (!mime) return ".bin";

  const cleanMime = mime.split(";")[0] ?? "";
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "audio/mpeg": ".mp3",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",
    "audio/webm": ".webm",
  };

  return extensions[cleanMime] ?? ".bin";
}

function decodeBase64(data: string) {
  const [, payload = data] = data.match(/^data:.*;base64,(.*)$/) ?? [];
  return Buffer.from(payload, "base64");
}

async function saveBase64File(
  folder: "files" | "audio",
  data?: Base64File
): Promise<StoredFile | null> {
  if (!data?.base64) return null;

  const targetDir = path.join(uploadRoot, folder);
  await mkdir(targetDir, { recursive: true });

  const originalName = data.fileName?.replace(/[^\w.\- ]/g, "").trim();
  const extension = path.extname(originalName ?? "") || extensionFromMime(data.mimeType);
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(targetDir, fileName);

  await writeFile(filePath, decodeBase64(data.base64));

  return {
    url: `/uploads/${folder}/${fileName}`,
    name: originalName || fileName,
    mime: data.mimeType ?? "application/octet-stream",
  };
}

function buildSearchText(data: CreateMaterialInput) {
  return [
    data.subject,
    data.materialType,
    data.contextText,
    data.noteText,
    data.file?.fileName,
    data.audio?.fileName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

async function removeUploadedFile(url?: string | null) {
  if (!url) return;

  const relativePath = url.replace(/^\/uploads\//, "");
  const filePath = path.resolve(uploadRoot, relativePath);

  if (!filePath.startsWith(uploadRoot)) return;

  await unlink(filePath).catch(() => undefined);
}

export class MaterialsService {
  async create(userId: number, data: CreateMaterialInput) {
    const [file, audio] = await Promise.all([
      saveBase64File("files", data.file),
      saveBase64File("audio", data.audio),
    ]);

    return prisma.studyMaterial.create({
      data: {
        user_id: userId,
        subject: data.subject,
        material_type: data.materialType,
        context_text: data.contextText,
        note_text: data.noteText || null,
        file_url: file?.url ?? null,
        file_name: file?.name ?? null,
        file_mime: file?.mime ?? null,
        audio_url: audio?.url ?? null,
        audio_name: audio?.name ?? null,
        audio_mime: audio?.mime ?? null,
        search_text: buildSearchText(data),
      },
    });
  }

  async search(userId: number, filters: SearchMaterialsInput) {
    const q = filters.q.toLowerCase();

    return prisma.studyMaterial.findMany({
      where: {
        user_id: userId,
        ...(q ? { search_text: { contains: q } } : {}),
        ...(filters.subject ? { subject: { contains: filters.subject, mode: "insensitive" } } : {}),
        ...(filters.materialType
          ? { material_type: { contains: filters.materialType, mode: "insensitive" } }
          : {}),
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async delete(userId: number, materialId: number) {
    const material = await prisma.studyMaterial.findFirst({
      where: {
        id: materialId,
        user_id: userId,
      },
    });

    if (!material) {
      throw new Error("Material nao encontrado");
    }

    await prisma.studyMaterial.delete({
      where: {
        id: material.id,
      },
    });

    await Promise.all([
      removeUploadedFile(material.file_url),
      removeUploadedFile(material.audio_url),
    ]);

    return { message: "Material excluido" };
  }
}
