/*
  Warnings:

  - A unique constraint covering the columns `[category,points]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Question_category_points_key` ON `Question`(`category`, `points`);
