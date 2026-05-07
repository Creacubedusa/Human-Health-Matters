import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { DoctorPostSessionSoapEditView } from '@features/doctor/screens/DoctorPostSessionSoapEditView';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';

export default function DoctorPostSessionSoapEditScreen() {
  const router = useRouter();
  const draft = useDoctorConsultationStore((state) => state.postSessionDraft);
  const updatePostSessionSoap = useDoctorConsultationStore((state) => state.updatePostSessionSoap);

  useEffect(() => {
    if (!draft) {
      router.replace('/(doctor)/consultations');
    }
  }, [draft, router]);

  if (!draft) return null;

  return (
    <DoctorPostSessionSoapEditView
      soap={draft.soap}
      onCancel={() => router.back()}
      onSave={(soap) => {
        updatePostSessionSoap('subjective', soap.subjective);
        updatePostSessionSoap('objective', soap.objective);
        updatePostSessionSoap('assessment', soap.assessment);
        updatePostSessionSoap('plan', soap.plan);
        router.back();
      }}
    />
  );
}
