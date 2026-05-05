import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { DonorPaymentMethodCard } from '../components/donation/DonorPaymentMethodCard';
import { useDonorPaymentMethod } from '../hooks/useDonorPaymentMethod';

export interface DonorPaymentMethodViewProps {
  onBack: () => void;
  onDonate: () => void;
  onAddCard: () => void;
}

export function DonorPaymentMethodView({ onBack, onDonate, onAddCard }: DonorPaymentMethodViewProps) {
  const { t } = useTranslation();
  const { status, methods, selectedId, amount, handleSelect, retry } = useDonorPaymentMethod();

  const canDonate = selectedId !== null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton
          onPress={onBack}
          accessibilityLabel={t('common.back')}
        />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorDonation.headerPayment')}
        </Text>
      </View>

      {status === 'loading' && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b2 font-sans text-grey-500">{t('donorDonation.loading')}</Text>
        </View>
      )}

      {status === 'error' && (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-b2 font-sans text-grey-500 text-center">{t('donorDonation.error')}</Text>
          <Button label={t('common.retry')} variant="outline" size="medium" onPress={() => void retry()} />
        </View>
      )}

      {status === 'success' && methods.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-b2 font-sans text-grey-500 text-center">{t('donorDonation.empty')}</Text>
        </View>
      )}

      {status === 'success' && methods.length > 0 && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-6 pb-10 gap-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View className="gap-2">
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('donorDonation.headerPayment')}
            </Text>
            <Text className="text-b2 font-sans text-grey-500">
              {t('donorDonation.paymentSubtitle')}
            </Text>
          </View>

          {/* Saved methods */}
          <View className="gap-3">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('donorDonation.savedMethodsTitle')}
            </Text>
            {methods.map((m) => (
              <DonorPaymentMethodCard
                key={m.id}
                variant="saved"
                method={m}
                selected={selectedId === m.id}
                onSelect={() => handleSelect(m.id)}
              />
            ))}
          </View>

          {/* Add new */}
          <View className="gap-3">
            <Text className="text-s2 font-semibold font-sans text-grey-900">
              {t('donorDonation.addNewMethodTitle')}
            </Text>
            <DonorPaymentMethodCard
              variant="add-new"
              icon="credit-card"
              label={t('donorDonation.debitCreditLabel')}
              subtitle={t('donorDonation.debitCreditSub')}
              onAdd={onAddCard}
            />
            <DonorPaymentMethodCard
              variant="add-new"
              icon="bank"
              label={t('donorDonation.bankTransferLabel')}
              subtitle={t('donorDonation.bankTransferSub')}
              onAdd={() => handleSelect('bank-transfer')}
            />
          </View>
        </ScrollView>
      )}

      {/* Sticky bottom CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorDonation.donateBtnLabel', { amount })}
          variant="filled"
          size="large"
          fullWidth
          disabled={!canDonate}
          onPress={onDonate}
          iconRight={
            <Ionicons name="arrow-forward" size={18} color={primitiveColors.white} />
          }
        />
      </View>
    </SafeAreaView>
  );
}
