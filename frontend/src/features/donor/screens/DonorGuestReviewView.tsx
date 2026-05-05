import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { ReviewCard } from '@shared/components/ui/ReviewCard';
import { useDonorGuestReview } from '../hooks/useDonorGuestReview';

export interface DonorGuestReviewViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function DonorGuestReviewView({ onBack, onSuccess }: DonorGuestReviewViewProps) {
  const { t } = useTranslation();
  const { amount, frequency, isProcessing, isSuccess, handleDonate, handleClose } = useDonorGuestReview();

  const typeLabel = frequency === 'monthly' ? t('donorGuest.monthly') : t('donorGuest.oneTime');

  const summaryRows = [
    { label: t('donorGuest.rowAmount'),     value: `$${amount}` },
    { label: t('donorGuest.rowType'),       value: typeLabel },
    { label: t('donorGuest.rowAllocation'), value: t('donorGuest.allocationValue') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorGuest.headerReview')}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('donorGuest.reviewTitle')}
        </Text>
        <ReviewCard title={t('donorGuest.summaryCardTitle')} rows={summaryRows} />
        <Alert status="info" variant="outline" description={t('donorGuest.alertInfo')} />
      </ScrollView>

      {/* Sticky CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorGuest.donateBtnLabel', { amount })}
          variant="filled"
          size="large"
          fullWidth
          disabled={isProcessing}
          onPress={() => void handleDonate()}
          iconRight={<Ionicons name="arrow-forward" size={18} color={primitiveColors.white} />}
        />
      </View>

      {/* Processing modal */}
      {isProcessing && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
          <View className="bg-white rounded-lg border border-grey-200 w-full px-6 py-8 items-center gap-4">
            <ActivityIndicator size="large" color={primitiveColors['primary-500']} />
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('donorGuest.processingText')}
            </Text>
          </View>
        </View>
      )}

      {/* Success modal */}
      {isSuccess && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-6">
          <View className="bg-white rounded-lg border border-grey-200 w-full overflow-hidden">
            <View className="flex-row items-center justify-end px-4 pt-4">
              <Ionicons
                name="close"
                size={20}
                color={primitiveColors['grey-400']}
                onPress={() => handleClose(onSuccess)}
                accessibilityRole="button"
                accessibilityLabel={t('common.dismiss')}
              />
            </View>
            <View className="items-center px-6 py-5 gap-4">
              <MaterialCommunityIcons name="check-decagram" size={50} color={primitiveColors['primary-500']} />
              <Text className="text-b1 font-sans text-grey-900 text-center">
                {t('donorGuest.successMessage', { amount })}
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
