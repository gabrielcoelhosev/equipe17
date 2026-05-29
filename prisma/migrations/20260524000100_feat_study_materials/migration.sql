-- CreateTable
CREATE TABLE "studyMaterial" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "material_type" TEXT NOT NULL,
    "context_text" TEXT NOT NULL,
    "note_text" TEXT,
    "file_url" TEXT,
    "file_name" TEXT,
    "file_mime" TEXT,
    "audio_url" TEXT,
    "audio_name" TEXT,
    "audio_mime" TEXT,
    "search_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studyMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "studyMaterial_user_id_idx" ON "studyMaterial"("user_id");

-- AddForeignKey
ALTER TABLE "studyMaterial" ADD CONSTRAINT "studyMaterial_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
