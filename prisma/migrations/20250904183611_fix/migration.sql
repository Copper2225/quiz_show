/*
  Warnings:

  - A unique constraint covering the columns `[column]` on the table `CategoryEntity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CategoryEntity_column_key` ON `CategoryEntity`(`column`);
