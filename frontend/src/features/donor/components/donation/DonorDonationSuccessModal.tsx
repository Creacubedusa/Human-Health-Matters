import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

export interface DonorDonationSuccessModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
}

export function DonorDonationSuccessModal({ visible, amount, onClose }: DonorDonationSuccessModalProps) {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
      <View className="bg-white rounded-lg border border-grey-200 w-full overflow-hidden">
        <View className="flex-row items-center justify-end px-4 pt-4">
          <Ionicons
            name="close"
            size={20}
            color={primitiveColors['grey-400']}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.dismiss')}
          />
        </View>

        <View className="items-center px-6 py-5 gap-4">
          <MaterialCommunityIcons
            name="check-decagram"
            size={50}
            color={primitiveColors['primary-500']}
          />
          <Text className="text-b1 font-sans text-grey-900 text-center">
            {t('donorDonation.successMessage', { amount })}
          </Text>
        </View>
      </View>
    </View>
  );
}
