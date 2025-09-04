/*
  Warnings:

  - You are about to drop the column `categoryColum` on the `QuestionEntity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryColumn,points]` on the table `QuestionEntity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryColumn` to the `QuestionEntity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `QuestionEntity_categoryColum_points_key` ON `QuestionEntity`;

-- AlterTable
ALTER TABLE `QuestionEntity` DROP COLUMN `categoryColum`,
    ADD COLUMN `categoryColumn` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `QuestionEntity_categoryColumn_points_key` ON `QuestionEntity`(`categoryColumn`, `points`);
