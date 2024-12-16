-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "MealPlan"("meal_plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
