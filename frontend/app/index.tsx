import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreenView } from '../src/shared/components/feedback/SplashScreenView';
import { getAccessToken } from '@shared/api/token';
import { kvGet } from '@shared/storage/kv';
import { useAuthStore } from '@shared/store/auth.store';

type AuthRole = 'patient' | 'doctor' | 'donor';

const ROLE_ROUTES: Record<AuthRole, string> = {
  patient: '/(patient)',
  doctor: '/(doctor)',
  donor: '/(donor)',
};

export default function IndexScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const [token, role, userId] = await Promise.all([
            getAccessToken(),
            kvGet('app_role'),
            kvGet('app_user_id'),
          ]);

          if (token && role && userId && ROLE_ROUTES[role as AuthRole]) {
            // Restore session into Zustand so the rest of the app works
            setToken(token);
            setAuth(userId, role as AuthRole);
            router.replace(ROLE_ROUTES[role as AuthRole] as any);
          } else {
            router.replace('/(auth)/select-language');
          }
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
