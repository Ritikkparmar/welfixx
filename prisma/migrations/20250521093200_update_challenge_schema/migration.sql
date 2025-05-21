/*
  Warnings:

  - The values [NOT_STARTED,IN_PROGRESS,COMPLETED] on the enum `ChallengeStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `user_challenges` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserChallengeStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
ALTER TABLE "user_challenges" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "challenges" ALTER COLUMN "status" TYPE "ChallengeStatus_new" USING ("status"::text::"ChallengeStatus_new");
ALTER TYPE "ChallengeStatus" RENAME TO "ChallengeStatus_old";
ALTER TYPE "ChallengeStatus_new" RENAME TO "ChallengeStatus";
DROP TYPE "ChallengeStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "durationDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "status" "ChallengeStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "user_challenges" DROP COLUMN "status",
ADD COLUMN     "status" "UserChallengeStatus" NOT NULL DEFAULT 'NOT_STARTED';
