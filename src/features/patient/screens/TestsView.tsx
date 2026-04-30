import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { PrescriptionFilterTabs } from '../components/prescription/PrescriptionFilterTabs';
import { TestResultCard } from '../components/tests/TestResultCard';
import { useTests } from '../hooks/useTests';
import type { TestTab } from '../types/tests.types';

export interface TestsViewProps {
  onBack: () => void;
}

export function TestsView({ onBack }: TestsViewProps) {
  const { t } = useTranslation();
  const { status, activeTab, filteredResults, uploadMetadata, setActiveTab, simulateUpload, retry } =
    useTests();

  const tabOptions: Array<{ label: string; value: TestTab }> = [
    { label: t('tests.tabLab'), value: 'lab' },
    { label: t('tests.tabImages'), value: 'images' },
  ];

  const sharedMeta = {
    orderedByLabel: t('tests.orderedByLabel'),
    dateLabel: t('tests.dateLabel'),
    orderedBy: uploadMetadata.orderedBy,
    date: uploadMetadata.date,
  };

  const header = <AppointmentBookingHeader title={t('tests.headerTitle')} onBack={onBack} />;

  if (status === 'loading') {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b2 font-semibold font-sans text-grey-900 text-center">
            {t('tests.errorTitle')}
          </Text>
          <Text className="text-b3 font-sans text-grey-500 text-center">
            {t('tests.errorDescription')}
          </Text>
          <Button label={t('common.retry')} onPress={retry} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-surface">
      {header}
      <ScrollView
        contentContainerClassName="px-4 pt-4 pb-8 gap-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text className="text-h5 font-semibold font-sans text-grey-900">
          {t('tests.pageTitle')}
        </Text>

        <View className="gap-4">
          {/* Tab switcher */}
          <PrescriptionFilterTabs
            options={tabOptions}
            activeValue={activeTab}
            onChange={setActiveTab}
          />

          {/* Upload card */}
          <TestResultCard
            mode="upload"
            uploadLabel={t('tests.uploadLabel')}
            {...sharedMeta}
            onPress={() => simulateUpload(activeTab)}
          />

          {/* Results section */}
          <View className="gap-4">
            <Text className="text-s1 font-semibold font-sans text-grey-900">
              {t('tests.resultsTitle')}
            </Text>

            {filteredResults.length === 0 ? (
              <View className="items-center justify-center py-12 gap-3">
                <Text className="text-b2 font-semibold font-sans text-grey-900 text-center">
                  {t('tests.emptyTitle')}
                </Text>
                <Text className="text-b3 font-sans text-grey-500 text-center">
                  {t('tests.emptySubtitle')}
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {filteredResults.map((result) => (
                  <TestResultCard
                    key={result.id}
                    mode="result"
                    fileName={result.fileName}
                    fileType={result.fileType}
                    orderedBy={result.orderedBy}
                    date={result.date}
                    orderedByLabel={t('tests.orderedByLabel')}
                    dateLabel={t('tests.dateLabel')}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
