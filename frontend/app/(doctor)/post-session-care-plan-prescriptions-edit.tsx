import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { DoctorPostSessionPrescriptionsEditView } from '@features/doctor/screens/DoctorPostSessionPrescriptionsEditView';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';

export default function DoctorPostSessionPrescriptionsEditScreen() {
  const router = useRouter();
  const draft = useDoctorConsultationStore((state) => state.postSessionDraft);
  const setPostSessionDraft = useDoctorConsultationStore((state) => state.setPostSessionDraft);

  useEffect(() => {
    if (!draft) {
      router.replace('/(doctor)/consultations');
    }
  }, [draft, router]);

  if (!draft) return null;

  return (
    <DoctorPostSessionPrescriptionsEditView
      prescriptions={draft.prescriptions}
      onCancel={() => router.back()}
      onSave={(prescriptions) => {
        setPostSessionDraft({
          ...draft,
          prescriptions,
        });
        router.back();
      }}
    />
  );
}
