import { useRouter } from 'expo-router';
import { NotificationView } from '@features/patient/screens/NotificationView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <NotificationView
      onBack={() => goBackOrReplace(router, '/(patient)')}
      onJoinConsultation={(appointmentId) =>
        router.push({
          pathname: '/(patient)/consultations',
          params: { appointmentId },
        })
      }
      onViewReport={() =>
        router.push({ pathname: '/(patient)/profile-record-detail', params: { id: 'support-report' } })
      }
      onCheckOrder={(id) =>
        router.push({ pathname: '/(patient)/order-detail', params: { id } })
      }
    />
  );
}
