import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';

interface DoctorPatientEmptyStateProps {
  searching: boolean;
}

export function DoctorPatientEmptyState({ searching }: DoctorPatientEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center justify-center py-16 px-6 gap-3">
      <View className="w-14 h-14 rounded-full bg-primary-50 items-center justify-center">
        <Ionicons name="search" size={24} color={primitiveColors['primary-500']} />
      </View>
      <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
        {searching ? t('doctorPatients.emptySearchTitle') : t('doctorPatients.emptyTitle')}
      </Text>
      <Text className="text-b3 font-sans text-grey-500 text-center">
        {searching ? t('doctorPatients.emptySearchSubtitle') : t('doctorPatients.emptySubtitle')}
      </Text>
    </View>
  );
}
