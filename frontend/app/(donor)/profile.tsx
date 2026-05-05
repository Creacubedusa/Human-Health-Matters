import { useRouter } from 'expo-router';
import { DonorProfileView } from '@features/donor/screens/DonorProfileView';

export default function DonorProfileScreen() {
  const router = useRouter();
  return (
    <DonorProfileView
      onEditCard={(cardId) =>
        router.push({ pathname: '/(donor)/profile-edit-card', params: { cardId } })
      }
      onEditFrequency={() => router.push('/(donor)/profile-frequency')}
      onAddMethod={() => router.push('/(donor)/profile-add-method')}
      onLanguage={() => {}}
      onPrivacyPolicy={() => {}}
    />
  );
}
