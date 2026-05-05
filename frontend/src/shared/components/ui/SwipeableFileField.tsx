import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { primitiveColors } from '@design/tokens';

export interface SwipeableFileFieldProps {
  label: string;
  onDelete: () => void;
  testID?: string;
}

export function SwipeableFileField({
  label,
  onDelete,
  testID,
}: SwipeableFileFieldProps) {
  const swipeableRef = useRef<Swipeable | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleDelete() {
    swipeableRef.current?.close();
    setIsOpen(false);
    onDelete();
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={24}
      overshootRight={false}
      onSwipeableOpen={() => setIsOpen(true)}
      onSwipeableClose={() => setIsOpen(false)}
      renderRightActions={() => (
        <Pressable
          onPress={handleDelete}
          className="items-center justify-center w-12 h-full rounded-md bg-white border-[1.5px] border-primary-300 ml-2"
          accessibilityRole="button"
          accessibilityLabel="Delete file"
        >
          <Ionicons name="trash-outline" size={20} color={primitiveColors['red-500']} />
        </Pressable>
      )}
      testID={testID}
    >
      <View
        className={[
          'flex-row items-center gap-3 rounded-md border-[1.5px] px-3 py-3 bg-grey-50',
          isOpen ? 'border-primary-300' : 'border-grey-200',
        ].join(' ')}
      >
        <Ionicons name="document-text" size={24} color="#EF4444" />
        <Text className="flex-1 text-b1 font-sans text-grey-900" numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Swipeable>
  );
}
