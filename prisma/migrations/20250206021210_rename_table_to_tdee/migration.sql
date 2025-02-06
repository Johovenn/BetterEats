/*
  Warnings:

  - You are about to drop the `UserBMR` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBMR" DROP CONSTRAINT "UserBMR_activity_level_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBMR" DROP CONSTRAINT "UserBMR_goal_id_fkey";

-- DropTable
DROP TABLE "UserBMR";

-- CreateTable
CREATE TABLE "UserTDEE" (
    "user_tdee_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_tdee_date" TIMESTAMP(3) NOT NULL,
    "user_weight" DOUBLE PRECISION NOT NULL,
    "user_height" DOUBLE PRECISION NOT NULL,
    "user_age" INTEGER NOT NULL,
    "user_tdee_value" INTEGER NOT NULL,
    "user_gender" TEXT NOT NULL,
    "activity_level_id" INTEGER NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "carbohydrate" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,

    CONSTRAINT "UserTDEE_pkey" PRIMARY KEY ("user_tdee_id")
);

-- AddForeignKey
ALTER TABLE "UserTDEE" ADD CONSTRAINT "UserTDEE_activity_level_id_fkey" FOREIGN KEY ("activity_level_id") REFERENCES "ActivityLevel"("activity_level_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTDEE" ADD CONSTRAINT "UserTDEE_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("goal_id") ON DELETE RESTRICT ON UPDATE CASCADE;
