import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { SupportActivityItem } from '../components/healthcare/SupportActivityItem';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { useHealthcareSupport } from '../hooks/useHealthcareSupport';

export interface HealthcareSupportViewProps {
  onBack: () => void;
}

export function HealthcareSupportView({ onBack }: HealthcareSupportViewProps) {
  const { t } = useTranslation();
  const { status, data, retry } = useHealthcareSupport();

  const header = (
    <ProfileHeader
      title={t('healthcareSupport.title')}
      backLabel={t('common.back')}
      onBack={onBack}
    />
  );

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-4 gap-4">
          <Text className="text-b2 font-sans text-grey-600 text-center">
            {t('healthcareSupport.errorMessage')}
          </Text>
          <Button
            label={t('common.retry')}
            onPress={retry}
            variant="outline"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'empty' || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {header}
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-b2 font-sans text-grey-600 text-center">
            {t('healthcareSupport.emptyMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-8 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View
          className="h-[129px] rounded-2xl border bg-primary-500 items-center justify-center px-4"
          style={{ borderColor: '#D0FAE5', borderWidth: 0.8 }}
        >
          <Text className="text-b3 font-sans text-white/60 text-center">
            {t('healthcareSupport.totalLabel')}
          </Text>
          <Text className="mt-2 text-h3 font-semibold font-sans text-white text-center">
            {data.totalSupportReceived}
          </Text>
          <Text className="mt-2 text-b4 font-medium font-sans text-white/60 text-center">
            {t('healthcareSupport.acrossVisits', { count: data.totalCareVisits })}
          </Text>
        </View>

        {/* Recent activity */}
        <View className="gap-4">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('healthcareSupport.recentActivity')}
          </Text>
          <View className="gap-2">
            {data.supportActivityList.map((activity) => (
              <SupportActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
