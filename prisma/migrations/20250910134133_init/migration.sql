-- CreateTable
CREATE TABLE `QuestionEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `prompt` VARCHAR(191) NOT NULL,
    `categoryColumn` INTEGER NOT NULL,
    `row` INTEGER NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL,
    `config` JSON NOT NULL,

    UNIQUE INDEX `QuestionEntity_categoryColumn_row_key`(`categoryColumn`, `row`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `column` INTEGER NOT NULL,

    UNIQUE INDEX `CategoryEntity_column_key`(`column`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
