/*
  Warnings:

  - You are about to drop the column `meal_plan_total_calories` on the `MealPlanDetail` table. All the data in the column will be lost.
  - You are about to drop the column `meal_plan_total_carbohydrates` on the `MealPlanDetail` table. All the data in the column will be lost.
  - You are about to drop the column `meal_plan_total_fat` on the `MealPlanDetail` table. All the data in the column will be lost.
  - You are about to drop the column `meal_plan_total_protein` on the `MealPlanDetail` table. All the data in the column will be lost.
  - Added the required column `meal_plan_total_calories` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_plan_total_carbohydrates` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_plan_total_fat` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_plan_total_protein` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "meal_plan_total_calories" INTEGER NOT NULL,
ADD COLUMN     "meal_plan_total_carbohydrates" INTEGER NOT NULL,
ADD COLUMN     "meal_plan_total_fat" INTEGER NOT NULL,
ADD COLUMN     "meal_plan_total_protein" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MealPlanDetail" DROP COLUMN "meal_plan_total_calories",
DROP COLUMN "meal_plan_total_carbohydrates",
DROP COLUMN "meal_plan_total_fat",
DROP COLUMN "meal_plan_total_protein";
