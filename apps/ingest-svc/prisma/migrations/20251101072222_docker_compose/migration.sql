-- CreateTable
CREATE TABLE "ingest_documents" (
    "document_id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "requested_by" TEXT,
    "title" TEXT NOT NULL,
    "content_type" TEXT,
    "visibility" TEXT,
    "retention_policy" TEXT,
    "metadata" JSONB,
    "source_uri" TEXT,
    "source_bucket" TEXT,
    "source_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingest_documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "ingest_document_chunks" (
    "document_id" TEXT NOT NULL,
    "chunk_id" TEXT NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "preview" TEXT,
    "token_count" INTEGER,
    "embedding" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingest_document_chunks_pkey" PRIMARY KEY ("document_id","chunk_id")
);

-- CreateIndex
CREATE INDEX "ingest_document_chunks_document_idx" ON "ingest_document_chunks"("document_id", "chunk_index");

-- AddForeignKey
ALTER TABLE "ingest_document_chunks" ADD CONSTRAINT "ingest_document_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "ingest_documents"("document_id") ON DELETE CASCADE ON UPDATE CASCADE;
