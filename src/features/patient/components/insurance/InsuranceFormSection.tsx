import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface InsuranceFormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function InsuranceFormSection({
  title,
  subtitle,
  children,
}: InsuranceFormSectionProps) {
  return (
    <View className="gap-4">
      <View className="gap-[5px]">
        <Text className="text-s1 font-semibold font-sans text-grey-900">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-b3 font-sans text-grey-500">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View className="gap-4">
        {children}
      </View>
    </View>
  );
}
