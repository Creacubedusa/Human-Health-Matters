import { useRouter } from 'expo-router';
import { DonorDonationReviewView } from '@features/donor/screens/DonorDonationReviewView';

export default function DonorDonateReviewScreen() {
  const router = useRouter();
  return (
    <DonorDonationReviewView
      onBack={() => router.back()}
      onSuccess={() => router.replace('/(donor)/')}
    />
  );
}
