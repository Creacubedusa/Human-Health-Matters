import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { toast } from '@shared/components/ui/toast';
import { DoctorInsuranceClaimDetailView } from '@features/doctor/screens/DoctorInsuranceClaimDetailView';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';
import { useDoctorPatientsStore } from '@features/doctor/store/doctorPatients.store';

export default function DoctorPostSessionInsuranceDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const draft = useDoctorConsultationStore((state) => state.postSessionDraft);
  const setPostSessionDraft = useDoctorConsultationStore((state) => state.setPostSessionDraft);
  const insuranceClaims = useDoctorPatientsStore((state) => state.insuranceClaims);
  const selectedInsuranceClaimId = useDoctorPatientsStore(
    (state) => state.selectedInsuranceClaimId,
  );
  const completeAppointment = useDoctorAppointmentsStore((state) => state.completeAppointment);

  const claim =
    insuranceClaims.find((item) => item.id === selectedInsuranceClaimId) ??
    (draft
      ? insuranceClaims.find(
          (item) =>
            item.patientId === draft.patientId &&
            item.consultationDate === draft.consultationDate &&
            item.consultationDuration === draft.duration,
        ) ?? null
      : null);

  function handleScheduleFollowUp() {
    if (!draft) {
      router.replace('/(doctor)/consultations');
      return;
    }

    setPostSessionDraft(null);
    router.replace({
      pathname: '/(doctor)/appointment-create',
      params: {
        patientId: draft.patientId,
        patientName: draft.patientName,
        title: t('doctorClaims.followUpTitle', { patientName: draft.patientName }),
      },
    });
  }

  function handleMarkCompleted() {
    if (!draft) {
      router.replace('/(doctor)/consultations');
      return;
    }

    completeAppointment(draft.appointmentId);
    setPostSessionDraft(null);
    toast.success(t('doctorClaims.completeSuccess'));
    router.replace('/(doctor)/consultations');
  }

  return (
    <DoctorInsuranceClaimDetailView
      claim={claim}
      title={t('doctorClaims.postSessionTitle')}
      subtitle={t('doctorClaims.postSessionSubtitle')}
      primaryActionLabel={t('doctorClaims.scheduleFollowUp')}
      secondaryActionLabel={t('doctorClaims.markCompleted')}
      onPrimaryAction={handleScheduleFollowUp}
      onSecondaryAction={handleMarkCompleted}
    />
  );
}
