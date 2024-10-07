-- AlterTable
ALTER TABLE "MealPlan" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "UserBMR" (
    "user_bmr_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_bmr_date" TIMESTAMP(3) NOT NULL,
    "user_weight" DOUBLE PRECISION NOT NULL,
    "user_height" DOUBLE PRECISION NOT NULL,
    "user_age" INTEGER NOT NULL,
    "user_bmr_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserBMR_pkey" PRIMARY KEY ("user_bmr_id")
);
