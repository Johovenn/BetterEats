/*
  Warnings:

  - You are about to drop the `MealDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealDetail" DROP CONSTRAINT "MealDetail_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "MealDetail" DROP CONSTRAINT "MealDetail_meal_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "MealDetail" DROP CONSTRAINT "MealDetail_meal_type_id_fkey";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "meal_image" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "MealDetail";

-- CreateTable
CREATE TABLE "MealPlanDetail" (
    "meal_plan_detail_id" SERIAL NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "meal_type_id" INTEGER NOT NULL,
    "meal_id" INTEGER NOT NULL,
    "meal_plan_total_calories" INTEGER NOT NULL,
    "meal_plan_total_carbohydrates" INTEGER NOT NULL,
    "meal_plan_total_protein" INTEGER NOT NULL,
    "meal_plan_total_fat" INTEGER NOT NULL,

    CONSTRAINT "MealPlanDetail_pkey" PRIMARY KEY ("meal_plan_detail_id")
);

-- CreateIndex
CREATE INDEX "MealPlan_meal_plan_id_meal_plan_date_idx" ON "MealPlan"("meal_plan_id", "meal_plan_date");

-- AddForeignKey
ALTER TABLE "MealPlanDetail" ADD CONSTRAINT "MealPlanDetail_meal_type_id_fkey" FOREIGN KEY ("meal_type_id") REFERENCES "MealType"("meal_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanDetail" ADD CONSTRAINT "MealPlanDetail_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "MealPlan"("meal_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanDetail" ADD CONSTRAINT "MealPlanDetail_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "Meal"("meal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
