-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "food_name" TEXT NOT NULL,
    "food_calories" INTEGER NOT NULL,
    "food_protein" INTEGER NOT NULL,
    "food_carbohydrate" INTEGER NOT NULL,
    "food_fat" INTEGER NOT NULL,
    "food_ingredients" TEXT NOT NULL,
    "food_recipe" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);
