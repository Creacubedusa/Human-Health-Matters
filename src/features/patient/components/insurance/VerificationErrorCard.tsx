import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface VerificationErrorField {
  label: string;
  value: string;
}

interface VerificationErrorCardProps {
  title: string;
  description: string;
  fields: VerificationErrorField[];
  ctaLabelKey: string;
  onRetry: () => void;
}

export function VerificationErrorCard({
  title,
  description,
  fields,
  ctaLabelKey,
  onRetry,
}: VerificationErrorCardProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4 rounded-md border-[1.5px] border-yellow-500 bg-yellow-50 p-4">
      <View className="gap-1">
        <Text className="text-s2 font-semibold font-sans text-grey-900">
          {title}
        </Text>
        <Text className="text-b3 font-sans text-grey-500">
          {description}
        </Text>
      </View>

      <View className="gap-3 rounded-md bg-white p-4">
        {fields.map((field) => (
          <View key={field.label} className="flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-b3 font-sans text-grey-500">
              {field.label}
            </Text>
            <Text className="flex-1 text-right text-b2 font-medium font-sans text-grey-900">
              {field.value}
            </Text>
          </View>
        ))}
      </View>

      <Pressable onPress={onRetry} accessibilityRole="button">
        {({ pressed }) => (
          <Text className={['text-btn-large font-semibold font-sans text-primary-500', pressed ? 'opacity-60' : ''].join(' ')}>
            {t(ctaLabelKey)}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
