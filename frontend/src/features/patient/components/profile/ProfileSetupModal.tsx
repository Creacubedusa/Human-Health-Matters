import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';

interface ProfileSetupModalProps {
  title: string;
  description: string;
  cancelLabel: string;
  continueLabel: string;
  closeLabel: string;
  onCancel: () => void;
  onContinue: () => void;
}

export function ProfileSetupModal({
  title,
  description,
  cancelLabel,
  continueLabel,
  closeLabel,
  onCancel,
  onContinue,
}: ProfileSetupModalProps) {
  return (
    <View className="bg-primary-50 border border-grey-200 rounded-lg w-full">
      <View className="items-end pt-4 px-4">
        <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel={closeLabel}>
          <Ionicons name="close" size={20} color={primitiveColors['grey-400']} />
        </Pressable>
      </View>

      <View className="items-center px-6 py-5 gap-4">
        <Text className="text-h5 font-semibold font-sans text-grey-900 text-center">
          {title}
        </Text>
        <Text className="text-b1 font-sans text-grey-600 text-center">
          {description}
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-4 px-6 pb-6">
        <View className="w-[127px]">
          <Button label={cancelLabel} onPress={onCancel} variant="outline" size="small" fullWidth />
        </View>
        <View className="w-[127px]">
          <Button label={continueLabel} onPress={onContinue} size="small" fullWidth />
        </View>
      </View>
    </View>
  );
}
