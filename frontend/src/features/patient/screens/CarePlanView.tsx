import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { useCarePlans } from '../hooks/useCarePlans';
import type { CarePlan } from '../types/carePlan.types';
import { CarePlanConsultationCard } from '../components/care-plan/CarePlanConsultationCard';
import { CarePlanHeader } from '../components/care-plan/CarePlanHeader';
import { CarePlanStatusToggle } from '../components/care-plan/CarePlanStatusToggle';

export interface CarePlanViewProps {
  onBack?: () => void;
  onViewCarePlan: (id: string) => void;
}

export function CarePlanView({ onBack, onViewCarePlan }: CarePlanViewProps) {
  const { t } = useTranslation();
  const {
    status,
    activeStatus,
    selectedCarePlans,
    setActiveStatus,
    retry,
  } = useCarePlans();

  const header = (
    <CarePlanHeader
      title={t('carePlan.headerTitle')}
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
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b3 font-sans text-grey-700 text-center">
            {t('carePlan.errorMessage')}
          </Text>
          <Button label={t('common.retry')} onPress={retry} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {header}

      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-28 gap-7"
        showsVerticalScrollIndicator={false}
        data={selectedCarePlans}
        keyExtractor={(item: CarePlan) => item.id}
        ListHeaderComponent={
          <View className="gap-6">
            <Text className="text-h5 font-semibold font-sans text-grey-900">
              {t('carePlan.overviewTitle')}
            </Text>
            <CarePlanStatusToggle
              activeStatus={activeStatus}
              onChange={setActiveStatus}
              activeLabel={t('carePlan.active')}
              inactiveLabel={t('carePlan.inactive')}
            />
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-16 gap-3">
            <Text className="text-s2 font-semibold font-sans text-grey-900 text-center">
              {status === 'empty'
                ? t('carePlan.emptyTitle')
                : t('carePlan.emptyFilteredTitle', {
                    status: activeStatus === 'active' ? t('carePlan.active') : t('carePlan.inactive'),
                  })}
            </Text>
            <Text className="text-b3 font-sans text-grey-500 text-center px-6">
              {t('carePlan.emptySubtitle')}
            </Text>
          </View>
        }
        renderItem={({ item }: { item: CarePlan }) => (
          <CarePlanConsultationCard
            carePlan={item}
            statusLabel={activeStatus === 'active' ? t('carePlan.active') : t('carePlan.inactive')}
            byDoctorLabel={t('carePlan.byDoctor', {
              name: item.doctorName,
              specialty: item.specialty,
            })}
            buttonLabel={t('carePlan.viewCarePlan')}
            onViewCarePlan={onViewCarePlan}
          />
        )}
      />
    </SafeAreaView>
  );
}
