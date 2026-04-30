import { Text, View } from 'react-native';

export interface StepProgressBarProps {
  progress: number;
  showPercent?: boolean;
  testID?: string;
}

// Figma: 5 equal segments, filled = primary-500, empty = primary-50
// progress 0→0 filled, 20→1, 40→2, 60→3, 80→4, 100→5
export function StepProgressBar({ progress, showPercent = false, testID }: StepProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const filledCount = Math.round(clamped / 20);

  return (
    <View className="flex-row gap-4 items-center" testID={testID}>
      <View className="flex-1 flex-row overflow-hidden rounded-lg">
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className={['flex-1 h-2', i < filledCount ? 'bg-primary-500' : 'bg-primary-50'].join(' ')}
          />
        ))}
      </View>
      {showPercent && (
        <Text className="text-b3 font-sans text-grey-900 shrink-0">{clamped}%</Text>
      )}
    </View>
  );
}
