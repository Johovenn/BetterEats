/*
  Warnings:

  - Added the required column `user_gender` to the `UserBMI` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBMI" ADD COLUMN     "user_gender" TEXT NOT NULL;
