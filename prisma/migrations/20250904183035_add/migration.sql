/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Question`;

-- CreateTable
CREATE TABLE `QuestionEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `prompt` VARCHAR(191) NOT NULL,
    `categoryColum` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `config` JSON NOT NULL,

    UNIQUE INDEX `QuestionEntity_categoryColum_points_key`(`categoryColum`, `points`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `column` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
