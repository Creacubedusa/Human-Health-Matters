import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreenView } from '../src/shared/components/feedback/SplashScreenView';
import { kvGet } from '@shared/storage/kv';
import { getAccessToken } from '@shared/api/token';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        const lang = await kvGet('app_language');
        if (!lang) {
          router.replace('/(auth)/select-language');
          return;
        }

        const token = await getAccessToken();
        const role = await kvGet('app_role');

        if (token) {
          if (role === 'doctor') router.replace('/(doctor)');
          else if (role === 'donor') router.replace('/(donor)');
          else router.replace('/(patient)');
          return;
        }

        router.replace('/(auth)/select-role');
      })();
    }, 800);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreenView />;
}
