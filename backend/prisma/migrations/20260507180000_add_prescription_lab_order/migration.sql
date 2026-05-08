-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PRESCRIPTION_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'LAB_ORDER_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'LAB_ORDER_SUBMITTED';

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LabOrderStatus" AS ENUM ('PENDING', 'SUBMITTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "SoapNote"
  ADD COLUMN "diagnoses" JSONB,
  ADD COLUMN "recommendedTests" JSONB;

-- CreateTable
CREATE TABLE "Prescription" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "appointmentId" TEXT,
  "medication" TEXT NOT NULL,
  "brandName" TEXT,
  "dose" TEXT NOT NULL,
  "frequency" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "route" TEXT NOT NULL,
  "refillsLeft" INTEGER NOT NULL DEFAULT 0,
  "totalRefills" INTEGER NOT NULL DEFAULT 0,
  "notes" TEXT,
  "status" "PrescriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "rxNumber" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_rxNumber_key" ON "Prescription"("rxNumber");
CREATE INDEX "Prescription_patientId_status_idx" ON "Prescription"("patientId", "status");
CREATE INDEX "Prescription_doctorId_idx" ON "Prescription"("doctorId");
CREATE INDEX "Prescription_appointmentId_idx" ON "Prescription"("appointmentId");

-- AddForeignKey
ALTER TABLE "Prescription"
  ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prescription"
  ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prescription"
  ADD CONSTRAINT "Prescription_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "LabOrder" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "appointmentId" TEXT,
  "testName" TEXT NOT NULL,
  "testType" TEXT,
  "priority" TEXT,
  "sampleType" TEXT,
  "collectionInstruction" TEXT,
  "additionalComment" TEXT,
  "status" "LabOrderStatus" NOT NULL DEFAULT 'PENDING',
  "submittedFiles" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LabOrder_patientId_status_idx" ON "LabOrder"("patientId", "status");
CREATE INDEX "LabOrder_doctorId_status_idx" ON "LabOrder"("doctorId", "status");
CREATE INDEX "LabOrder_appointmentId_idx" ON "LabOrder"("appointmentId");

-- AddForeignKey
ALTER TABLE "LabOrder"
  ADD CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LabOrder"
  ADD CONSTRAINT "LabOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LabOrder"
  ADD CONSTRAINT "LabOrder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
