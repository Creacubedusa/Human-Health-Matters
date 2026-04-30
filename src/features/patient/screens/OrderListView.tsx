import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { AppointmentBookingHeader } from '../components/booking/AppointmentBookingHeader';
import { PrescriptionFilterTabs } from '../components/prescription/PrescriptionFilterTabs';
import { OrderCard } from '../components/order/OrderCard';
import { OrderOverviewCard } from '../components/order/OrderOverviewCard';
import { useOrders } from '../hooks/useOrders';
import type { OrderFilter } from '../types/order.types';

export interface OrderListViewProps {
  onBack: () => void;
  onSelectOrder: (id: string) => void;
}

export function OrderListView({ onBack, onSelectOrder }: OrderListViewProps) {
  const { t } = useTranslation();
  const {
    status,
    filter,
    filteredOrders,
    ongoingCount,
    completedCount,
    completionPercent,
    setFilter,
    retry,
  } = useOrders();

  const filterOptions: Array<{ label: string; value: OrderFilter }> = [
    { label: t('order.filterOngoing'), value: 'ongoing' },
    { label: t('order.filterCompleted'), value: 'completed' },
  ];

  const cardLabels = {
    urgent: t('order.urgentLabel'),
    notUrgent: t('order.notUrgentLabel'),
    orderedBy: t('order.orderedBy'),
  };

  const overviewLabels = {
    title: t('order.overviewTitle'),
    ongoing: t('order.filterOngoing'),
    completed: t('order.filterCompleted'),
  };

  const header = (
    <AppointmentBookingHeader title={t('order.headerTitle')} onBack={onBack} />
  );

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
            {t('order.errorTitle')}
          </Text>
          <Text className="text-b3 font-sans text-grey-500 text-center">
            {t('order.errorDescription')}
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
        contentContainerClassName="px-4 pt-3 pb-8 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Overview card */}
        <OrderOverviewCard
          ongoingCount={ongoingCount}
          completedCount={completedCount}
          completionPercent={completionPercent}
          labels={overviewLabels}
        />

        {/* Section title */}
        <Text className="text-s1 font-semibold font-sans text-grey-900">
          {t('order.sectionTitle')}
        </Text>

        {/* Filter tabs */}
        <PrescriptionFilterTabs
          options={filterOptions}
          activeValue={filter}
          onChange={setFilter}
        />

        {/* Order list or empty state */}
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-16 gap-3">
            <Text className="text-b2 font-semibold font-sans text-grey-900 text-center">
              {t('order.emptyTitle')}
            </Text>
            <Text className="text-b3 font-sans text-grey-500 text-center">
              {t('order.emptySubtitle')}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredOrders.map((item) => (
              <OrderCard
                key={item.id}
                item={item}
                labels={cardLabels}
                onPress={onSelectOrder}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
