-- AlterTable
ALTER TABLE "DoctorProfile"
ADD COLUMN     "availabilitySetAt" TIMESTAMP(3),
ADD COLUMN     "availabilitySettings" JSONB;
