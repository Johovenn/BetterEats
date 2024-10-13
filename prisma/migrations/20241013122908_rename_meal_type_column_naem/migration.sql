/*
  Warnings:

  - You are about to drop the column `meal_type_name` on the `MealType` table. All the data in the column will be lost.
  - Added the required column `meal_type_description` to the `MealType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealType" DROP COLUMN "meal_type_name",
ADD COLUMN     "meal_type_description" TEXT NOT NULL;
