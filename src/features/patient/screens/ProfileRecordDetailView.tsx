import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { usePatientProfileOverview } from '../hooks/usePatientProfileOverview';
import type { ProfileRecordId } from '../types/profileOverview.types';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export interface ProfileRecordDetailViewProps {
  recordId: ProfileRecordId | 'support-report';
  onBack: () => void;
}

export function ProfileRecordDetailView({ recordId, onBack }: ProfileRecordDetailViewProps) {
  const { t } = useTranslation();
  const { profile, selectedRecord } = usePatientProfileOverview();
  const record = recordId === 'support-report' ? null : selectedRecord(recordId);
  const isSupport = recordId === 'support-report';

  const title = isSupport
    ? t('profileOverview.supportReportTitle')
    : record?.title ?? t('profileOverview.recordDetails');

  const details = isSupport
    ? profile?.healthcareSupport.report ?? []
    : record?.details ?? [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ProfileHeader title={title} backLabel={t('common.back')} onBack={onBack} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {!isSupport && record?.summary != null && (
          <Text className="text-b2 font-sans text-grey-600">{record.summary}</Text>
        )}

        <View className="bg-white border border-grey-200 rounded-2xl p-4 gap-3">
          {details.length > 0 ? (
            details.map((detail) => (
              <View key={detail} className="flex-row gap-2">
                <Text className="text-b3 font-sans text-primary-500">{'\u2022'}</Text>
                <Text className="flex-1 text-b3 font-sans text-grey-700">{detail}</Text>
              </View>
            ))
          ) : (
            <Text className="text-b3 font-sans text-grey-500">
              {t('profileOverview.emptyRecord')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
