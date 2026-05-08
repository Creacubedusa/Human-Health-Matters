import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

interface Props {
  onCheckSymptoms: () => void;
}

// Figma Screen 2: "Oops! No Recent Activity" + description + Check Symptoms pill CTA
export function EmptyActivityState({ onCheckSymptoms }: Props) {
  const { t } = useTranslation();

  return (
    <View className="bg-white py-7 px-[22px] items-start w-full">
      <View className="gap-6 w-full">
        {/* Text block */}
        <View className="gap-2 items-center w-full">
          <Text className="text-h4 font-semibold font-sans text-grey-900 text-center">
            {t('patientHome.emptyTitle')}
          </Text>
          <Text className="text-b1 font-sans text-grey-600 text-center">
            {t('patientHome.emptyDesc')}
          </Text>
        </View>

        {/* Check Symptoms pill CTA — Figma: bg-primary-500, border-4 border-primary-100, rounded-[32px], shadow, w-[238px] */}
        <View className="items-center w-full">
          <Pressable
            onPress={onCheckSymptoms}
            className="bg-primary-500 border-4 border-primary-100 rounded-[32px] px-4 py-3 w-[238px] items-center"
            style={{
              shadowColor: '#131927',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.14,
              shadowRadius: 28,
              elevation: 8,
            }}
            accessibilityRole="button"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="sparkles" size={20} color={primitiveColors['white']} />
              <Text className="text-btn-medium font-sans text-white">
                {t('patientHome.checkSymptoms')}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
