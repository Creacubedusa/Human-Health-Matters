import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { DoctorPostSessionRecommendedTestsEditView } from '@features/doctor/screens/DoctorPostSessionRecommendedTestsEditView';
import { useDoctorConsultationStore } from '@features/doctor/store/doctorConsultation.store';

export default function DoctorPostSessionRecommendedTestsEditScreen() {
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
    <DoctorPostSessionRecommendedTestsEditView
      tests={draft.recommendedTests}
      onCancel={() => router.back()}
      onSave={(tests) => {
        setPostSessionDraft({
          ...draft,
          recommendedTests: tests,
        });
        router.back();
      }}
    />
  );
}
