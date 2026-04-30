import { useRouter } from 'expo-router';
import { InsuranceCoverageView } from '@features/patient/screens/InsuranceCoverageView';
import { createAppointmentAccessSnapshot } from '@features/patient/services/appointmentBooking.service';
import { useAppointmentBookingStore } from '@features/patient/store/appointmentBooking.store';
import { useTriageStore } from '@features/patient/store/triage.store';
import type { CoverageResult } from '@features/patient/types/insuranceCoverage.types';

export default function InsuranceScreen() {
  const router = useRouter();
  const triageResult = useTriageStore((state) => state.currentSession?.result ?? null);
  const setAccessSnapshot = useAppointmentBookingStore((state) => state.setAccessSnapshot);

  function handleBookConsultation(coverageResult: CoverageResult) {
    setAccessSnapshot(createAppointmentAccessSnapshot(coverageResult, triageResult));
    router.push('/(patient)/appointment-booking');
  }

  return (
    <InsuranceCoverageView
      onExit={() => router.back()}
      onBookConsultation={handleBookConsultation}
    />
  );
}
