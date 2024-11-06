-- CreateTable
CREATE TABLE "UserBMI" (
    "user_bmi_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_bmi_date" TIMESTAMP(3) NOT NULL,
    "user_weight" DOUBLE PRECISION NOT NULL,
    "user_height" DOUBLE PRECISION NOT NULL,
    "user_age" INTEGER NOT NULL,
    "user_bmi_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserBMI_pkey" PRIMARY KEY ("user_bmi_id")
);
