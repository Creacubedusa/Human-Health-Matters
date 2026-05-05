import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { DoctorHomeView } from '@features/doctor/screens/DoctorHomeView';
import { fetchDoctorProfile } from '@features/doctor/services/doctor.service';
import { kvDelete, kvGet } from '@shared/storage/kv';

const DOCTOR_PROFILE_SETUP_REQUIRED_KEY = 'doctor_profile_setup_required';

export default function DoctorHomeScreen() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      try {
        const res = await fetchDoctorProfile();
        const completed = Boolean(res.profile?.onboardingCompletedAt);

        if (completed) {
          await kvDelete(DOCTOR_PROFILE_SETUP_REQUIRED_KEY);
        } else {
          const requiresProfileSetup = await kvGet(DOCTOR_PROFILE_SETUP_REQUIRED_KEY);
          if (requiresProfileSetup === '1') {
            router.replace('/(auth)/doctor-profile-setup');
          }
        }
      } catch (error) {
        console.warn('Doctor home profile bootstrap failed', error);
      }
    }
    void run();
  }, [router]);

  return <DoctorHomeView />;
}
