/*
  Warnings:

  - You are about to alter the column `can_switch_to_list` on the `funds` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - Added the required column `fund_asset_type_id` to the `fund_allocations` table without a default value. This is not possible if the table is not empty.
  - Made the column `max_unit_issued` on table `funds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `fund_allocations` ADD COLUMN `fund_asset_type_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `funds` MODIFY `max_unit_issued` DOUBLE NOT NULL,
    MODIFY `can_switch_to_list` JSON NULL;

-- CreateTable
CREATE TABLE `fund_asset_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `fund_asset_types_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fund_allocations` ADD CONSTRAINT `fund_allocations_fund_asset_type_id_fkey` FOREIGN KEY (`fund_asset_type_id`) REFERENCES `fund_asset_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
