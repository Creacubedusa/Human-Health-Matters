import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DoctorHomeView } from '@features/doctor/screens/DoctorHomeView';
import { fetchDoctorProfile } from '@features/doctor/services/doctor.service';

export default function DoctorHomeScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    let isMounted = true;
    async function run() {
      try {
        const res = await fetchDoctorProfile();
        const completed = Boolean(res.profile?.onboardingCompletedAt);
        if (!completed) router.replace('/(auth)/doctor-onboarding');
      } finally {
        if (isMounted) setStatus('ready');
      }
    }
    void run();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-bg-default items-center justify-center">
        <View className="items-center gap-3">
          <ActivityIndicator size="large" color="#4E61F6" />
        </View>
      </SafeAreaView>
    );
  }

  return <DoctorHomeView />;
}
