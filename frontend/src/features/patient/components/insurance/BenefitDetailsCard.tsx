import { Text, View } from 'react-native';

interface BenefitDetailsCardProps {
  title: string;
  items: Array<{ label: string; value: string }>;
}

export function BenefitDetailsCard({ title, items }: BenefitDetailsCardProps) {
  return (
    <View className="gap-6 rounded-[16px] bg-grey-50 px-5 py-4">
      <Text className="text-s1 font-semibold font-sans text-grey-900">
        {title}
      </Text>

      <View className="gap-4">
        {items.map((item) => (
          <View key={item.label} className="flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-b4 font-medium font-sans text-grey-500">
              {item.label}
            </Text>
            <Text className="flex-1 text-right text-b2 font-semibold font-sans text-grey-900">
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
