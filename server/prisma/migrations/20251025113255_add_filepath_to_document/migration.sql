/*
  Warnings:

  - You are about to drop the column `sourcePath` on the `Document` table. All the data in the column will be lost.
  - Added the required column `filePath` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `mimeType` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "sourcePath",
ADD COLUMN     "filePath" TEXT NOT NULL,
ALTER COLUMN "mimeType" SET NOT NULL;
