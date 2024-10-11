-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "meal_calories" SET DEFAULT 0,
ALTER COLUMN "meal_protein" SET DEFAULT 0,
ALTER COLUMN "meal_carbohydrate" SET DEFAULT 0,
ALTER COLUMN "meal_fat" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "MealPlan" ALTER COLUMN "meal_plan_total_fat" SET DEFAULT 0,
ALTER COLUMN "meal_plan_total_protein" SET DEFAULT 0,
ALTER COLUMN "meal_plan_total_calorie" SET DEFAULT 0,
ALTER COLUMN "meal_plan_total_carbohydrate" SET DEFAULT 0;
