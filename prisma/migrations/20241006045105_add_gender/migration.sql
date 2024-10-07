/*
  Warnings:

  - Added the required column `user_gender` to the `UserBMR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBMR" ADD COLUMN     "user_gender" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Gender" (
    "gender_id" SERIAL NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("gender_id")
);
