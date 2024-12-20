-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_meal_plan_id_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "meal_plan_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "MealPlan"("meal_plan_id") ON DELETE SET NULL ON UPDATE CASCADE;
