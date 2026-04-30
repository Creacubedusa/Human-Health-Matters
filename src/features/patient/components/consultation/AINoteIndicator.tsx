import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

export interface AINoteIndicatorProps {
  active: boolean;
}

export function AINoteIndicator({ active }: AINoteIndicatorProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!active) return null;

  return (
    <Pressable
      className="absolute top-14 left-4"
      onPress={() => setExpanded((prev) => !prev)}
      accessibilityRole="button"
      accessibilityLabel={t('consultation.aiNoteActive')}
    >
      {expanded ? (
        <View className="h-[37px] min-w-[123px] flex-row items-center justify-center gap-2 rounded-2xl bg-grey-50 px-3">
          <Ionicons name="mic" size={16} color={primitiveColors['green-500']} />
          <Text className="text-c1 font-medium font-sans text-text-primary">
            {t('consultation.aiNoteActive')}
          </Text>
        </View>
      ) : (
        <View className="h-[37px] w-8 items-center justify-center rounded-2xl bg-grey-50">
          <Ionicons name="mic" size={16} color={primitiveColors['green-500']} />
        </View>
      )}
    </Pressable>
  );
}
