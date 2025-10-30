/*
  Warnings:

  - You are about to drop the column `valuation_frequency` on the `funds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `funds` DROP COLUMN `valuation_frequency`,
    ADD COLUMN `yearly_basis` INTEGER NOT NULL DEFAULT 365;
