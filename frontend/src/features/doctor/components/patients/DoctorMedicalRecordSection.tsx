import { Text, View } from 'react-native';
import { Button } from '@shared/components/ui/Button';

interface DoctorMedicalRecordSectionProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
}

export function DoctorMedicalRecordSection({
  title,
  actionLabel,
  onActionPress,
  children,
}: DoctorMedicalRecordSectionProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-s2 font-semibold font-sans text-grey-900 flex-1">{title}</Text>
        {actionLabel ? (
          <Button
            label={actionLabel}
            onPress={onActionPress}
            variant="outline"
            size="small"
          />
        ) : null}
      </View>
      {children}
    </View>
  );
}
