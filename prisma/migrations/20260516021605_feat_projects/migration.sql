-- CreateEnum
CREATE TYPE "linkType" AS ENUM ('FRONTEND', 'BACKEND', 'DEMO', 'FIGMA', 'DOCS', 'YOUTUBE');

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbail_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectStack" (
    "projectId" INTEGER NOT NULL,
    "stackId" INTEGER NOT NULL,

    CONSTRAINT "projectStack_pkey" PRIMARY KEY ("projectId","stackId")
);

-- CreateTable
CREATE TABLE "projectLink" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "type" "linkType" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "projectLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_thumbail_url_key" ON "project"("thumbail_url");

-- AddForeignKey
ALTER TABLE "projectStack" ADD CONSTRAINT "projectStack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectStack" ADD CONSTRAINT "projectStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectLink" ADD CONSTRAINT "projectLink_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
