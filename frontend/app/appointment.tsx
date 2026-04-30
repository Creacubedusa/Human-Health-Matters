import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AppointmentAliasScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(patient)/appointment');
  }, [router]);

  return null;
}

