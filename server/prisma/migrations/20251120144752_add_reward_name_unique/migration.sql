/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Reward` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reward_name_key" ON "Reward"("name");
