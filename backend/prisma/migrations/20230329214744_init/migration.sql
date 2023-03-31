/*
  Warnings:

  - Made the column `authorId` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "authorId" SET NOT NULL;
