import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface DonorDonationProcessingModalProps {
  visible: boolean;
}

export function DonorDonationProcessingModal({ visible }: DonorDonationProcessingModalProps) {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
      <View className="bg-white rounded-lg border border-grey-200 w-full px-6 py-8 items-center gap-4">
        <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        <Text className="text-s2 font-semibold font-sans text-grey-900">
          {t('donorDonation.processingText')}
        </Text>
      </View>
    </View>
  );
}
