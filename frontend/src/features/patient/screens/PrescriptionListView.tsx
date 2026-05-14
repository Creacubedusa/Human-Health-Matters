import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { PrescriptionCard } from '../components/prescription/PrescriptionCard';
import { PrescriptionFilterTabs } from '../components/prescription/PrescriptionFilterTabs';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { TabletContainer } from '@shared/components/ui/TabletContainer';
import type { PrescriptionFilter } from '../types/prescription.types';

export interface PrescriptionListViewProps {
  onBack: () => void;
  onSelectPrescription: (id: string) => void;
}

export function PrescriptionListView({ onBack, onSelectPrescription }: PrescriptionListViewProps) {
  const { t } = useTranslation();
  const { status, filter, filteredPrescriptions, setFilter, retry, refresh, refreshing } =
    usePrescriptions();

  const filterOptions: Array<{ label: string; value: PrescriptionFilter }> = [
    { label: t('prescription.filterAll'), value: 'all' },
    { label: t('prescription.filterActive'), value: 'active' },
    { label: t('prescription.filterInactive'), value: 'inactive' },
  ];

  const cardLabels = {
    activeStatus: t('prescription.filterActive'),
    inactiveStatus: t('prescription.filterInactive'),
    refillLeft: t('prescription.refillLeft_one', { count: 0 }),
    noRefillLeft: t('prescription.noRefillLeft'),
  };

  const header = (
    <AppointmentBookingHeader title={t('prescription.headerTitle')} onBack={onBack} />
  );

  if (status === 'loading') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
        {header}
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b2 font-semibold font-sans text-grey-900 text-center">
            {t('prescription.errorTitle')}
          </Text>
          <Text className="text-b3 font-sans text-grey-500 text-center">
            {t('prescription.errorDescription')}
          </Text>
          <Button label={t('common.retry')} onPress={() => void retry()} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface">
      {header}
      <TabletContainer>
        <ScrollView
          contentContainerClassName="px-4 pt-6 pb-8 gap-8"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              tintColor={primitiveColors['primary-500']}
              colors={[primitiveColors['primary-500']]}
            />
          }
        >
          {/* Page title */}
          <Text className="text-h5 font-semibold font-sans text-grey-900">
            {t('prescription.headerTitle')}
          </Text>

          <View className="gap-4">
            {/* Filter tabs */}
            <PrescriptionFilterTabs
              options={filterOptions}
              activeValue={filter}
              onChange={setFilter}
            />

            {/* Card list or empty state */}
            {status === 'success' && filteredPrescriptions.length === 0 ? (
              <View className="items-center justify-center py-16 gap-3">
                <Text className="text-b2 font-semibold font-sans text-grey-900 text-center">
                  {t('prescription.emptyTitle')}
                </Text>
                <Text className="text-b3 font-sans text-grey-500 text-center">
                  {t('prescription.emptySubtitle')}
                </Text>
              </View>
            ) : (
              <View className="gap-7">
                {filteredPrescriptions.map((item) => (
                  <PrescriptionCard
                    key={item.id}
                    item={item}
                    labels={{
                      ...cardLabels,
                      refillLeft:
                        item.refillsLeft === 1
                          ? t('prescription.refillLeft_one', { count: item.refillsLeft })
                          : t('prescription.refillLeft_other', { count: item.refillsLeft }),
                    }}
                    onPress={onSelectPrescription}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </TabletContainer>
    </SafeAreaView>
  );
}
