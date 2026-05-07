import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { Input } from '@shared/components/ui/Input';
import { useDonorGuestCard } from '../hooks/useDonorGuestCard';

export interface DonorGuestAddCardViewProps {
  onBack: () => void;
  onAdd: () => void;
}

export function DonorGuestAddCardView({ onBack, onAdd }: DonorGuestAddCardViewProps) {
  const { t } = useTranslation();
  const { cardNumber, expiry, cvv, zipCode, isValid, handleCardNumber, handleExpiry, handleCvv, handleZip } = useDonorGuestCard();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorGuest.addCardHeader')}
        </Text>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-6 pb-10 gap-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('donorGuest.addCardTitle')}
          </Text>

          <View className="gap-4">
            <Input
              label={t('donorGuest.cardNumberLabel')}
              placeholder={t('donorGuest.cardNumberPlaceholder')}
              value={cardNumber}
              onChangeText={handleCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label={t('donorGuest.expiryLabel')}
                  placeholder={t('donorGuest.expiryPlaceholder')}
                  value={expiry}
                  onChangeText={handleExpiry}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View className="flex-1">
                <Input
                  label={t('donorGuest.cvvLabel')}
                  placeholder={t('donorGuest.cvvPlaceholder')}
                  value={cvv}
                  onChangeText={handleCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <Input
              label={t('donorGuest.zipLabel')}
              placeholder=""
              value={zipCode}
              onChangeText={handleZip}
              maxLength={10}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky CTA — no Save Card */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorGuest.addBtn')}
          variant="filled"
          size="large"
          fullWidth
          disabled={!isValid}
          onPress={onAdd}
        />
      </View>
    </SafeAreaView>
  );
}
