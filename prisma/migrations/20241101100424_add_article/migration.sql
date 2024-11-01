-- CreateTable
CREATE TABLE "Article" (
    "article_id" SERIAL NOT NULL,
    "article_title" TEXT NOT NULL,
    "article_description" TEXT NOT NULL,
    "article_body" TEXT NOT NULL,
    "article_creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("article_id")
);
