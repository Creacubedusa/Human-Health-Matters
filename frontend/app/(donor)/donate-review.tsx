import { useRouter } from 'expo-router';
import { DonorDonationReviewView } from '@features/donor/screens/DonorDonationReviewView';
import { goBackOrReplace } from '@shared/navigation/goBackOrReplace';

export default function DonorDonateReviewScreen() {
  const router = useRouter();
  return (
    <DonorDonationReviewView
      onBack={() => goBackOrReplace(router, '/(donor)/donate-payment')}
      onSuccess={() => router.replace('/(donor)/')}
    />
  );
}
