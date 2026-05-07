-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_startsAt_key" ON "Appointment"("doctorId", "startsAt");
