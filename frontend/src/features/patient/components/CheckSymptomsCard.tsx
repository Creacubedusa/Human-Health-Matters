import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

interface Props {
  variant: 'arrow' | 'start';
  onPress: () => void;
}

export function CheckSymptomsCard({ variant, onPress }: Props) {
  const { t } = useTranslation();

  const description = variant === 'start'
    ? t('patientHome.checkSymptomDescShort')
    : t('patientHome.checkSymptomDesc');

  return (
    <Pressable
      onPress={variant === 'arrow' ? onPress : undefined}
      className="bg-primary-500 rounded-2xl p-4 w-full"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center shrink-0">
          <Ionicons name="sparkles" size={24} color={primitiveColors['primary-500']} />
        </View>

        {/* Text */}
        <View className="flex-1 gap-2">
          <Text className="text-b2 font-sans text-white">
            {t('patientHome.checkSymptomTitle')}
          </Text>
          <Text className="text-b3 font-sans text-white/70">{description}</Text>
        </View>

        {/* Right element */}
        {variant === 'arrow' ? (
          <Ionicons name="chevron-forward" size={24} color={primitiveColors['white']} />
        ) : (
          <Pressable
            onPress={onPress}
            className="bg-white rounded-xl h-10 w-[72px] items-center justify-center shrink-0"
            accessibilityRole="button"
          >
            <Text className="text-btn-medium font-sans text-primary-500">
              {t('patientHome.start')}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
