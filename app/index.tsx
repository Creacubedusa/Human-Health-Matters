import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreenView } from '../src/shared/components/feedback/SplashScreenView';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/select-language');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreenView />;
}
