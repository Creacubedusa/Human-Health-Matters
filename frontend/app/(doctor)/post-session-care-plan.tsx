import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { toast } from '@shared/components/ui/toast';
import { DoctorPostSessionCarePlanView } from '@features/doctor/screens/DoctorPostSessionCarePlanView';
import { DoctorCarePlanCompletionModal } from '@features/doctor/components/consultation/DoctorCarePlanCompletionModal';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';
import { useDoctorPatientsStore } from '@features/doctor/store/doctorPatients.store';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';
import { createPatientCarePlanFromDraft } from '@features/doctor/utils/postSessionCarePlan';
import { upsertDoctorSoapNote } from '@features/doctor/services/doctor.service';
import { useCarePlanStore } from '@features/patient/store/carePlan.store';

const DOCTOR_NAME = 'Doctor Paul Grant';
const DOCTOR_SPECIALTY = 'Cardiologist';

export default function DoctorPostSessionCarePlanScreen() {
  const router = useRouter();
  const draft = useDoctorConsultationStore((state) => state.postSessionDraft);
  const soapSubmitting = useDoctorConsultationStore((state) => state.soapSubmitting);
  const setSoapSubmitting = useDoctorConsultationStore((state) => state.setSoapSubmitting);
  const setPostSessionDraft = useDoctorConsultationStore((state) => state.setPostSessionDraft);
  const addCarePlanSummary = useDoctorPatientsStore((state) => state.addCarePlanSummary);
  const recordInsuranceClaim = useDoctorPatientsStore((state) => state.recordInsuranceClaim);
  const completeAppointment = useDoctorAppointmentsStore((state) => state.completeAppointment);
  const addCarePlan = useCarePlanStore((state) => state.addCarePlan);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [carePlanSaved, setCarePlanSaved] = useState(false);

  useEffect(() => {
    if (!draft) {
      router.replace('/(doctor)/consultations');
    }
  }, [draft, router]);

  if (!draft) return null;
  const activeDraft = draft;

  async function handleApprove() {
    if (carePlanSaved) {
      setCompletionModalOpen(true);
      return;
    }

    setSoapSubmitting(true);
    try {
      await upsertDoctorSoapNote(activeDraft.appointmentId, activeDraft.soap);
      const carePlan = createPatientCarePlanFromDraft(activeDraft, DOCTOR_NAME, DOCTOR_SPECIALTY);
      addCarePlan(carePlan);
      addCarePlanSummary(activeDraft.patientId, {
        id: carePlan.id,
        status: carePlan.status,
        title: carePlan.consultationTitle,
        doctorName: DOCTOR_NAME,
        specialty: DOCTOR_SPECIALTY,
        date: carePlan.consultationDate,
      });
      setCarePlanSaved(true);
      const claim = recordInsuranceClaim({
        patientId: activeDraft.patientId,
        appointmentId: activeDraft.appointmentId,
        consultationDate: activeDraft.consultationDate,
        consultationDuration: activeDraft.duration,
      });
      toast.success('Care plan created successfully.');
      if (claim) {
        router.push('/(doctor)/post-session-insurance-details');
        return;
      }
      setCompletionModalOpen(true);
    } catch {
      toast.error('Unable to save care plan. Please try again.');
    } finally {
      setSoapSubmitting(false);
    }
  }

  function handleScheduleFollowUp() {
    setCompletionModalOpen(false);
    setPostSessionDraft(null);
    router.replace({
      pathname: '/(doctor)/appointment-create',
      params: {
        patientId: activeDraft.patientId,
        patientName: activeDraft.patientName,
        title: `Follow up with ${activeDraft.patientName}`,
      },
    });
  }

  function handleMarkCompleted() {
    completeAppointment(activeDraft.appointmentId);
    setCompletionModalOpen(false);
    setPostSessionDraft(null);
    toast.success('Appointment marked as completed.');
    router.replace('/(doctor)/consultations');
  }

  return (
    <>
      <DoctorPostSessionCarePlanView
        draft={activeDraft}
        submitting={soapSubmitting}
        onBack={() => router.back()}
        onApprove={() => void handleApprove()}
        onEditSoap={() => router.push('/(doctor)/post-session-care-plan-soap-edit')}
        onEditDiagnoses={() => router.push('/(doctor)/post-session-care-plan-diagnoses-edit')}
        onEditRecommendedTests={() =>
          router.push('/(doctor)/post-session-care-plan-recommended-tests-edit')
        }
        onEditPrescriptions={() =>
          router.push('/(doctor)/post-session-care-plan-prescriptions-edit')
        }
        onOrderTest={() =>
          router.push({
            pathname: '/(doctor)/patients/[patientId]/create-order',
            params: {
              patientId: activeDraft.patientId,
              returnTo: 'post-session-care-plan',
            },
          })
        }
        onAddPrescription={() =>
          router.push({
            pathname: '/(doctor)/patients/[patientId]/add-prescription',
            params: {
              patientId: activeDraft.patientId,
              returnTo: 'post-session-care-plan',
            },
          })
        }
      />

      <DoctorCarePlanCompletionModal
        visible={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        onScheduleFollowUp={handleScheduleFollowUp}
        onMarkCompleted={handleMarkCompleted}
      />
    </>
  );
}
