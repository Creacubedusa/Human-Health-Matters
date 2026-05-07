import { useRouter } from 'expo-router';
import { DonorGuestReviewView } from '@features/donor/screens/DonorGuestReviewView';

export default function GuestReviewScreen() {
  const router = useRouter();
  return (
    <DonorGuestReviewView
      onBack={() => router.back()}
      onSuccess={() => router.replace('/(auth)/donor-get-started')}
    />
  );
}
