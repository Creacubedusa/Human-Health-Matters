import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface DonorProfilePaymentRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onEdit: () => void;
}

export function DonorProfilePaymentRow({ icon, title, subtitle, onEdit }: DonorProfilePaymentRowProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center border border-grey-200 rounded-lg px-3 py-4 gap-3 bg-white">
      <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
        {icon}
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-b2 font-medium font-sans text-grey-900">{title}</Text>
        <Text className="text-b4 font-sans text-grey-500">{subtitle}</Text>
      </View>

      <Pressable
        onPress={onEdit}
        className="flex-row items-center gap-1 shrink-0"
        accessibilityRole="button"
        accessibilityLabel={t('donorProfile.editBtn')}
      >
        <Text className="text-b3 font-medium font-sans text-primary-500">
          {t('donorProfile.editBtn')}
        </Text>
        <Feather name="chevron-right" size={14} color={primitiveColors['primary-500']} />
      </Pressable>
    </View>
  );
}
