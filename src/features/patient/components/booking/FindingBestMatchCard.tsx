import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { PaginationDots } from '@shared/components/ui/PaginationDots';
import { NuraAvatar } from './NuraAvatar';

export interface FindingBestMatchCardProps {
  title: string;
}

export function FindingBestMatchCard({ title }: FindingBestMatchCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 3);
    }, 350);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View className="flex-row items-center gap-6 pt-10">
      <NuraAvatar />
      <View className="gap-1">
        <Text className="text-b2 font-medium font-sans text-grey-900">
          {title}
        </Text>
        <View className="self-start rounded-xl bg-grey-50 px-3 py-2">
          <PaginationDots count={3} activeIndex={activeIndex} variant="dot" />
        </View>
      </View>
    </View>
  );
}
