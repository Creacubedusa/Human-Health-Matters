-- AlterTable
ALTER TABLE "DoctorProfile" DROP COLUMN "specialty",
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];

