import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { DoctorPostSessionDiagnosesEditView } from '@features/doctor/screens/DoctorPostSessionDiagnosesEditView';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';

export default function DoctorPostSessionDiagnosesEditScreen() {
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
    <DoctorPostSessionDiagnosesEditView
      diagnoses={draft.diagnoses}
      onCancel={() => router.back()}
      onSave={(diagnoses) => {
        setPostSessionDraft({
          ...draft,
          diagnoses,
        });
        router.back();
      }}
    />
  );
}
