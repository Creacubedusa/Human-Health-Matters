import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreenView } from '../src/shared/components/feedback/SplashScreenView';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      void (async () => {
        try {
          router.replace('/(auth)/select-language');
        } catch (error) {
          console.warn('Index bootstrap failed', error);
          router.replace('/(auth)/select-language');
        }
      })();
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreenView />;
}
