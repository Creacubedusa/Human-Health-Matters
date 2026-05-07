import { useRouter } from 'expo-router';
import { DoctorProfileSetupWizardView } from '@features/doctor/screens/DoctorProfileSetupWizardView';
import { kvDelete } from '@shared/storage/kv';

const DOCTOR_PROFILE_SETUP_REQUIRED_KEY = 'doctor_profile_setup_required';

export default function DoctorProfileSetupScreen() {
  const router = useRouter();
  return (
    <DoctorProfileSetupWizardView
      onComplete={() => {
        kvDelete(DOCTOR_PROFILE_SETUP_REQUIRED_KEY).finally(() => {
          router.replace('/(doctor)');
        });
      }}
    />
  );
}
