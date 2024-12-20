-- DropIndex
DROP INDEX "UserFavoriteMeals_meal_id_key";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Post" (
    "post_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_body" TEXT NOT NULL,
    "post_date" TIMESTAMP(3) NOT NULL,
    "meal_plan_id" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);
