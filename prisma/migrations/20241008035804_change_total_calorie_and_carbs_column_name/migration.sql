/*
  Warnings:

  - You are about to drop the column `meal_plan_total_calories` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `meal_plan_total_carbohydrates` on the `MealPlan` table. All the data in the column will be lost.
  - Added the required column `meal_plan_total_calorie` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_plan_total_carbohydrate` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "meal_plan_total_calories",
DROP COLUMN "meal_plan_total_carbohydrates",
ADD COLUMN     "meal_plan_total_calorie" INTEGER NOT NULL,
ADD COLUMN     "meal_plan_total_carbohydrate" INTEGER NOT NULL;
