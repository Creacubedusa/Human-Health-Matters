-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('DAILY');

-- CreateEnum
CREATE TYPE "VideoSessionStatus" AS ENUM ('CREATED', 'ACTIVE', 'ENDED');

-- CreateTable
CREATE TABLE "VideoSession" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "provider" "VideoProvider" NOT NULL DEFAULT 'DAILY',
    "status" "VideoSessionStatus" NOT NULL DEFAULT 'CREATED',
    "roomName" TEXT NOT NULL,
    "roomUrl" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoSession_appointmentId_key" ON "VideoSession"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoSession_roomName_key" ON "VideoSession"("roomName");

-- CreateIndex
CREATE INDEX "VideoSession_provider_status_idx" ON "VideoSession"("provider", "status");

-- AddForeignKey
ALTER TABLE "VideoSession" ADD CONSTRAINT "VideoSession_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
