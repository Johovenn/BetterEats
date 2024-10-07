/*
  Warnings:

  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Food";

-- CreateTable
CREATE TABLE "Meal" (
    "meal_id" SERIAL NOT NULL,
    "meal_name" TEXT NOT NULL,
    "meal_calories" INTEGER NOT NULL,
    "meal_protein" INTEGER NOT NULL,
    "meal_carbohydrate" INTEGER NOT NULL,
    "meal_fat" INTEGER NOT NULL,
    "meal_ingredients" TEXT NOT NULL,
    "meal_recipe" TEXT NOT NULL,
    "is_breakfast" BOOLEAN NOT NULL DEFAULT false,
    "is_lunch" BOOLEAN NOT NULL DEFAULT false,
    "is_dinner" BOOLEAN NOT NULL DEFAULT false,
    "is_snack" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("meal_id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "meal_plan_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "meal_plan_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("meal_plan_id")
);

-- CreateTable
CREATE TABLE "MealDetail" (
    "meal_detail_id" SERIAL NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,
    "meal_type_id" INTEGER NOT NULL,
    "meal_id" INTEGER NOT NULL,

    CONSTRAINT "MealDetail_pkey" PRIMARY KEY ("meal_detail_id")
);

-- CreateTable
CREATE TABLE "MealType" (
    "meal_type_id" SERIAL NOT NULL,
    "meal_type_name" TEXT NOT NULL,

    CONSTRAINT "MealType_pkey" PRIMARY KEY ("meal_type_id")
);

-- AddForeignKey
ALTER TABLE "MealDetail" ADD CONSTRAINT "MealDetail_meal_type_id_fkey" FOREIGN KEY ("meal_type_id") REFERENCES "MealType"("meal_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDetail" ADD CONSTRAINT "MealDetail_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "MealPlan"("meal_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDetail" ADD CONSTRAINT "MealDetail_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "Meal"("meal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
