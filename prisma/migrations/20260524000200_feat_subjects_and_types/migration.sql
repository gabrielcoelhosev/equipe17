-- CreateTable
CREATE TABLE "studySubject" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studySubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studyMaterialType" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studyMaterialType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "studySubject_user_id_idx" ON "studySubject"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "studySubject_user_id_name_key" ON "studySubject"("user_id", "name");

-- CreateIndex
CREATE INDEX "studyMaterialType_user_id_idx" ON "studyMaterialType"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "studyMaterialType_user_id_name_key" ON "studyMaterialType"("user_id", "name");

-- AddForeignKey
ALTER TABLE "studySubject" ADD CONSTRAINT "studySubject_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studyMaterialType" ADD CONSTRAINT "studyMaterialType_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
