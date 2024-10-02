/*
  Warnings:

  - You are about to drop the column `user_bmr_date` on the `UserBMR` table. All the data in the column will be lost.
  - You are about to alter the column `user_bmr_value` on the `UserBMR` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `carbohydrate` to the `UserBMR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `UserBMR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `UserBMR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_recorded_date` to the `UserBMR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBMR" DROP COLUMN "user_bmr_date",
ADD COLUMN     "carbohydrate" INTEGER NOT NULL,
ADD COLUMN     "fat" INTEGER NOT NULL,
ADD COLUMN     "protein" INTEGER NOT NULL,
ADD COLUMN     "user_recorded_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "user_bmr_value" SET DATA TYPE INTEGER;
