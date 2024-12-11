-- AlterTable
ALTER TABLE "MealPlanDetail" ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserFavoriteMeals" (
    "favorite_meal_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "meal_id" INTEGER NOT NULL,

    CONSTRAINT "UserFavoriteMeals_pkey" PRIMARY KEY ("favorite_meal_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMeals_meal_id_key" ON "UserFavoriteMeals"("meal_id");

-- AddForeignKey
ALTER TABLE "UserFavoriteMeals" ADD CONSTRAINT "UserFavoriteMeals_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "Meal"("meal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
