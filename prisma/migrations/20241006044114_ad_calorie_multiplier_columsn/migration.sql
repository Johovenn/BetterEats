/*
  Warnings:

  - Added the required column `activity_level_id` to the `UserBMR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_id` to the `UserBMR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBMR" ADD COLUMN     "activity_level_id" INTEGER NOT NULL,
ADD COLUMN     "goal_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ActivityLevel" (
    "activity_level_id" SERIAL NOT NULL,
    "activity_level_multiplier" DOUBLE PRECISION NOT NULL,
    "activity_level_description" TEXT NOT NULL,

    CONSTRAINT "ActivityLevel_pkey" PRIMARY KEY ("activity_level_id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "goal_id" SERIAL NOT NULL,
    "goal_description" TEXT NOT NULL,
    "goal_calorie_multiplier" DOUBLE PRECISION NOT NULL,
    "goal_protein_multiplier" DOUBLE PRECISION NOT NULL,
    "goal_carbohydrate_multiplier" DOUBLE PRECISION NOT NULL,
    "goal_fat_multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("goal_id")
);

-- AddForeignKey
ALTER TABLE "UserBMR" ADD CONSTRAINT "UserBMR_activity_level_id_fkey" FOREIGN KEY ("activity_level_id") REFERENCES "ActivityLevel"("activity_level_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBMR" ADD CONSTRAINT "UserBMR_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("goal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
