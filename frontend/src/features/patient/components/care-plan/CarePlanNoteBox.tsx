import { Text, View } from 'react-native';

interface CarePlanNoteBoxProps {
  title: string;
  body?: string;
  items?: string[];
}

export function CarePlanNoteBox({ title, body, items }: CarePlanNoteBoxProps) {
  return (
    <View className="gap-2">
      <Text className="text-b2 font-medium font-sans text-grey-900">{title}</Text>
      <View className="bg-grey-50 rounded-lg px-4 py-3">
        {body ? (
          <Text className="text-b3 font-sans text-grey-600">{body}</Text>
        ) : (
          <View className="gap-1">
            {items?.map((item, index) => (
              <View key={`${index}-${item}`} className="flex-row gap-2">
                <Text className="text-b3 font-sans text-grey-600">{index + 1}.</Text>
                <Text className="flex-1 text-b3 font-sans text-grey-600">{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
