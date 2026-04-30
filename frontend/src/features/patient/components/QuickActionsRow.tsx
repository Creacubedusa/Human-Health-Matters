import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';

interface Props {
  onBook: () => void;
  onDiagnosis: () => void;
  onPrescription: () => void;
  onTest: () => void;
}

interface ActionItemProps {
  bgClass: string;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function ActionItem({ bgClass, icon, label, onPress }: ActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center gap-2 w-[74px]"
      accessibilityRole="button"
    >
      <View className={['w-8 h-8 rounded-2xl items-center justify-center', bgClass].join(' ')}>
        {icon}
      </View>
      <Text className="text-c2 font-sans text-grey-900 text-center w-full">{label}</Text>
    </Pressable>
  );
}

// Figma: 4 quick action pills — Book(blue), Diagnosis(red), Prescription(green), Test(primary)
export function QuickActionsRow({ onBook, onDiagnosis, onPrescription, onTest }: Props) {
  const { t } = useTranslation();

  return (
    <View className="bg-white px-4 py-2.5 w-full">
      <Text className="text-s2 font-semibold font-sans text-grey-900 mb-4">
        {t('patientHome.quickAction')}
      </Text>
      <View className="flex-row justify-between">
        <ActionItem
          bgClass="bg-blue-500"
          icon={<Ionicons name="calendar-outline" size={16} color={primitiveColors.white} />}
          label={t('patientHome.book')}
          onPress={onBook}
        />
        <ActionItem
          bgClass="bg-red-500"
          icon={<MaterialIcons name="medical-services" size={16} color={primitiveColors.white} />}
          label={t('patientHome.diagnosis')}
          onPress={onDiagnosis}
        />
        <ActionItem
          bgClass="bg-green-500"
          icon={<Ionicons name="document-text-outline" size={16} color={primitiveColors.white} />}
          label={t('patientHome.prescription')}
          onPress={onPrescription}
        />
        <ActionItem
          bgClass="bg-primary-500"
          icon={<Ionicons name="flask-outline" size={16} color={primitiveColors.white} />}
          label={t('patientHome.test')}
          onPress={onTest}
        />
      </View>
    </View>
  );
}
