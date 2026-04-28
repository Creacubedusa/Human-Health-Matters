import { Text, View } from 'react-native';
import { Button } from '@shared/components/ui/Button';

interface SecondaryAction {
  id: string;
  label: string;
  onPress: () => void;
}

interface BottomActionBarProps {
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  reasonMessage?: string | null;
  secondaryActions?: SecondaryAction[];
}

export function BottomActionBar({
  primaryLabel,
  onPrimaryPress,
  primaryDisabled = false,
  reasonMessage,
  secondaryActions = [],
}: BottomActionBarProps) {
  return (
    <View className="border-t border-grey-100 bg-white px-5 py-6 gap-3">
      <Button
        label={primaryLabel}
        onPress={onPrimaryPress}
        variant="filled"
        size="large"
        fullWidth
        disabled={primaryDisabled}
      />

      {reasonMessage ? (
        <Text className="text-center text-b3 font-sans text-grey-500">
          {reasonMessage}
        </Text>
      ) : null}

      {secondaryActions.length > 0 ? (
        <View className="flex-row flex-wrap justify-center gap-2">
          {secondaryActions.map((action) => (
            <Button
              key={action.id}
              label={action.label}
              onPress={action.onPress}
              variant="clear"
              size="tiny"
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
