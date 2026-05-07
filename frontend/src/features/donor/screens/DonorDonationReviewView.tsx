import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { Alert } from '@shared/components/ui/Alert';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { ReviewCard } from '@shared/components/ui/ReviewCard';
import { DonorDonationProcessingModal } from '../components/donation/DonorDonationProcessingModal';
import { DonorDonationSuccessModal } from '../components/donation/DonorDonationSuccessModal';
import { useDonorDonationReview } from '../hooks/useDonorDonationReview';

export interface DonorDonationReviewViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function DonorDonationReviewView({ onBack, onSuccess }: DonorDonationReviewViewProps) {
  const { t } = useTranslation();
  const { draft, isProcessing, isSuccess, handleDonate, handleSuccessClose } = useDonorDonationReview();

  const typeLabel = draft.type === 'monthly'
    ? t('donorDonation.monthly')
    : t('donorDonation.oneTime');

  const summaryRows = [
    { label: t('donorDonation.rowAmount'), value: `$${draft.amount}` },
    { label: t('donorDonation.rowType'), value: typeLabel },
    { label: t('donorDonation.rowAllocation'), value: t('donorDonation.allocationValue') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton
          onPress={onBack}
          accessibilityLabel={t('common.back')}
        />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorDonation.headerReview')}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('donorDonation.reviewTitle')}
        </Text>

        {/* Summary card */}
        <ReviewCard
          title={t('donorDonation.summaryCardTitle')}
          rows={summaryRows}
        />

        {/* Info alert */}
        <Alert
          status="info"
          variant="outline"
          description={t('donorDonation.alertInfo')}
        />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorDonation.donateBtnLabel', { amount: draft.amount })}
          variant="filled"
          size="large"
          fullWidth
          disabled={isProcessing}
          onPress={() => void handleDonate()}
          iconRight={
            <Ionicons name="arrow-forward" size={18} color={primitiveColors.white} />
          }
        />
      </View>

      {/* Modals */}
      <DonorDonationProcessingModal visible={isProcessing} />
      <DonorDonationSuccessModal
        visible={isSuccess}
        amount={draft.amount}
        onClose={() => handleSuccessClose(onSuccess)}
      />
    </SafeAreaView>
  );
}
