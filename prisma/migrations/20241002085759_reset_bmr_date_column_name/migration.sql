/*
  Warnings:

  - You are about to drop the column `user_recorded_date` on the `UserBMR` table. All the data in the column will be lost.
  - Added the required column `user_bmr_date` to the `UserBMR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBMR" DROP COLUMN "user_recorded_date",
ADD COLUMN     "user_bmr_date" TIMESTAMP(3) NOT NULL;
