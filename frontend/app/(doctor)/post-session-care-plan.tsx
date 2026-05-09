import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { toast } from '@shared/components/ui/toast';
import { DoctorPostSessionCarePlanView } from '@features/doctor/screens/DoctorPostSessionCarePlanView';
import { DoctorCarePlanCompletionModal } from '@features/doctor/components/consultation/DoctorCarePlanCompletionModal';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';
import { useDoctorPatientsStore } from '@features/doctor/store/doctorPatients.store';
import { useDoctorAppointmentsStore } from '@features/doctor/store/doctorAppointments.store';
import { createPatientCarePlanFromDraft } from '@features/doctor/utils/postSessionCarePlan';
import {
  createDoctorPrescriptions,
  fetchDoctorProfile,
  upsertDoctorSoapNote,
  type DoctorPrescriptionPayload,
  type DoctorProfileResponse,
} from '@features/doctor/services/doctor.service';
import { useCarePlanStore } from '@features/patient/store/carePlan.store';

export default function DoctorPostSessionCarePlanScreen() {
  const router = useRouter();
  const draft = useDoctorConsultationStore((state) => state.postSessionDraft);
  const soapSubmitting = useDoctorConsultationStore((state) => state.soapSubmitting);
  const setSoapSubmitting = useDoctorConsultationStore((state) => state.setSoapSubmitting);
  const setPostSessionDraft = useDoctorConsultationStore((state) => state.setPostSessionDraft);
  const updatePostSessionSoap = useDoctorConsultationStore((state) => state.updatePostSessionSoap);
  const addCarePlanSummary = useDoctorPatientsStore((state) => state.addCarePlanSummary);
  const recordInsuranceClaim = useDoctorPatientsStore((state) => state.recordInsuranceClaim);
  const completeAppointment = useDoctorAppointmentsStore((state) => state.completeAppointment);
  const addCarePlan = useCarePlanStore((state) => state.addCarePlan);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [carePlanSaved, setCarePlanSaved] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchDoctorProfile()
      .then((value) => {
        if (cancelled) return;
        setDoctorProfile(value);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const doctorName = useMemo(() => {
    const first = doctorProfile?.user?.firstName ?? '';
    const last = doctorProfile?.user?.lastName ?? '';
    const combined = [first, last].filter(Boolean).join(' ').trim();
    return combined ? `Doctor ${combined}` : 'Doctor';
  }, [doctorProfile?.user?.firstName, doctorProfile?.user?.lastName]);

  const doctorSpecialty = useMemo(
    () => doctorProfile?.profile?.specialties?.[0] ?? 'General Practice',
    [doctorProfile?.profile?.specialties],
  );

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
      await upsertDoctorSoapNote(activeDraft.appointmentId, {
        subjective: activeDraft.soap.subjective,
        objective: activeDraft.soap.objective,
        assessment: activeDraft.soap.assessment,
        plan: activeDraft.soap.plan,
        diagnoses: activeDraft.diagnoses
          .filter((diagnosis) => diagnosis.name.trim().length > 0)
          .map((diagnosis) => ({
            id: diagnosis.id,
            name: diagnosis.name,
            icd10Code: diagnosis.icd10Code,
            priority: diagnosis.priority,
          })),
        recommendedTests: activeDraft.recommendedTests
          .filter((test) => test.name.trim().length > 0)
          .map((test) => ({ id: test.id, name: test.name })),
      });

      const newPrescriptions: DoctorPrescriptionPayload[] = activeDraft.prescriptions
        .filter(
          (rx) =>
            rx.medication.trim().length > 0 &&
            rx.dose.trim().length > 0 &&
            rx.frequency.trim().length > 0 &&
            rx.duration.trim().length > 0 &&
            rx.route.trim().length > 0,
        )
        .map((rx) => ({
          medication: rx.medication,
          brandName: rx.brandName || undefined,
          dose: rx.dose,
          frequency: rx.frequency,
          duration: rx.duration,
          route: rx.route,
          refillsLeft: rx.refillsLeft,
          notes: rx.notes || undefined,
        }));
      if (newPrescriptions.length > 0) {
        await createDoctorPrescriptions(
          { appointmentId: activeDraft.appointmentId },
          newPrescriptions,
        );
      }

      const carePlan = createPatientCarePlanFromDraft(activeDraft, doctorName, doctorSpecialty);
      addCarePlan(carePlan);
      addCarePlanSummary(activeDraft.patientId, {
        id: carePlan.id,
        status: carePlan.status,
        title: carePlan.consultationTitle,
        doctorName,
        specialty: doctorSpecialty,
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
        onUpdateSoap={(field, value) => updatePostSessionSoap(field, value)}
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
