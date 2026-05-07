import { useRouter } from 'expo-router';
import { NotificationView } from '@features/patient/screens/NotificationView';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <NotificationView
      onBack={() => router.back()}
      onJoinConsultation={() => router.push('/(patient)/consultations')}
      onViewReport={() =>
        router.push({ pathname: '/(patient)/profile-record-detail', params: { id: 'support-report' } })
      }
      onCheckOrder={(id) =>
        router.push({ pathname: '/(patient)/order-detail', params: { id } })
      }
    />
  );
}
