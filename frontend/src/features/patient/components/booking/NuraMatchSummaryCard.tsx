import { Text, View } from 'react-native';
import { NuraAvatar } from './NuraAvatar';

export interface NuraMatchSummaryCardProps {
  title: string;
  message: string;
}

export function NuraMatchSummaryCard({ title, message }: NuraMatchSummaryCardProps) {
  return (
    <View className="flex-row items-start gap-6">
      <NuraAvatar />
      <View className="flex-1 rounded-tl-md rounded-tr-xl rounded-br-xl rounded-bl-xl bg-grey-50 px-4 py-4">
        <Text className="text-b2 font-medium font-sans text-grey-900">
          {title}
        </Text>
        <Text className="mt-2 text-b3 font-sans text-grey-900">
          {message}
        </Text>
      </View>
    </View>
  );
}
