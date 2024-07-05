-- CreateTable
CREATE TABLE `Food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `food_name` VARCHAR(191) NOT NULL,
    `food_calories` INTEGER NOT NULL,
    `food_protein` INTEGER NOT NULL,
    `food_carbohydrate` INTEGER NOT NULL,
    `food_fat` INTEGER NOT NULL,
    `food_ingredients` VARCHAR(191) NOT NULL,
    `food_recipe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
