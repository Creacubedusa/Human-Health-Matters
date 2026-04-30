-- AlterTable
ALTER TABLE "PatientProfile" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "profileData" JSONB;
