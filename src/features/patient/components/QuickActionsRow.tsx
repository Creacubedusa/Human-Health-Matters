import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';

// Figma icon image URLs (7-day expiry — replace with local assets when available)
const BOOK_ICON  = 'https://www.figma.com/api/mcp/asset/5621e135-33d3-4f78-aa47-4ca443ae8d56';
const DIAG_ICON  = 'https://www.figma.com/api/mcp/asset/2017cd9d-2836-4244-8d9c-30fdde17ebf5';
const PRESC_ICON = 'https://www.figma.com/api/mcp/asset/81fb8662-0234-4658-94dd-25099115bbdf';
const TEST_ICON  = 'https://www.figma.com/api/mcp/asset/bdeaba92-471d-4d1b-b397-ea046f5c1aa4';

interface Props {
  onBook: () => void;
  onDiagnosis: () => void;
  onPrescription: () => void;
  onTest: () => void;
}

interface ActionItemProps {
  bgClass: string;
  iconUri: string;
  label: string;
  onPress: () => void;
}

function ActionItem({ bgClass, iconUri, label, onPress }: ActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center gap-2 w-[74px]"
      accessibilityRole="button"
    >
      <View className={['w-8 h-8 rounded-2xl items-center justify-center', bgClass].join(' ')}>
        <Image source={{ uri: iconUri }} style={{ width: 16, height: 16 }} resizeMode="contain" />
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
        <ActionItem bgClass="bg-blue-500"    iconUri={BOOK_ICON}  label={t('patientHome.book')}         onPress={onBook} />
        <ActionItem bgClass="bg-red-500"     iconUri={DIAG_ICON}  label={t('patientHome.diagnosis')}    onPress={onDiagnosis} />
        <ActionItem bgClass="bg-green-500"   iconUri={PRESC_ICON} label={t('patientHome.prescription')} onPress={onPrescription} />
        <ActionItem bgClass="bg-primary-500" iconUri={TEST_ICON}  label={t('patientHome.test')}         onPress={onTest} />
      </View>
    </View>
  );
}
