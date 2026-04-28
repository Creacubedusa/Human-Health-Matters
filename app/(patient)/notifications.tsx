import { useRouter } from 'expo-router';
import { NotificationView } from '@features/patient/screens/NotificationView';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <NotificationView
      onBack={() => router.back()}
      onJoinConsultation={() => {}}
      onViewReport={() => {}}
      onCheckOrder={() => {}}
    />
  );
}
