import { Text, View } from 'react-native';

export interface LegalDocumentSectionProps {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export function LegalDocumentSection({
  title,
  paragraphs = [],
  bullets = [],
}: LegalDocumentSectionProps) {
  return (
    <View className="w-full gap-1">
      {title ? (
        <Text className="text-[16px] font-bold font-sans text-grey-700 leading-6 tracking-[0.2px]">
          {title}
        </Text>
      ) : null}

      {paragraphs.map((paragraph) => (
        <Text
          key={paragraph}
          className="text-[16px] font-sans text-grey-700 leading-6 tracking-[0.2px]"
        >
          {paragraph}
        </Text>
      ))}

      {bullets.map((bullet) => (
        <View key={bullet} className="flex-row items-start gap-2">
          <Text className="pt-[3px] text-[16px] font-sans text-grey-700 leading-6 tracking-[0.2px]">
            {'\u2022'}
          </Text>
          <Text className="flex-1 text-[16px] font-sans text-grey-700 leading-6 tracking-[0.2px]">
            {bullet}
          </Text>
        </View>
      ))}
    </View>
  );
}
