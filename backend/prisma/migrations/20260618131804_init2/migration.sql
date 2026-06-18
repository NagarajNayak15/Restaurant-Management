/*
  Warnings:

  - Added the required column `non_veg` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "non_veg" BOOLEAN NOT NULL;
