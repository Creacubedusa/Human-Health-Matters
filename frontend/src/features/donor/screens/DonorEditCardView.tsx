import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { CheckboxGroup } from '@shared/components/ui/CheckboxGroup';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { Input } from '@shared/components/ui/Input';
import { useDonorEditCard } from '../hooks/useDonorEditCard';
import { TabletContainer } from '@shared/components/ui/TabletContainer';

export interface DonorEditCardViewProps {
  cardId: string;
  onBack: () => void;
  onSave: () => void;
}

export function DonorEditCardView({ cardId, onBack, onSave }: DonorEditCardViewProps) {
  const { t } = useTranslation();
  const {
    cardNumber, expiry, cvv, zipCode, saveCard, isValid,
    handleCardNumber, handleExpiry, handleCvv, handleZip, handleSaveCard, handleSave,
  } = useDonorEditCard(cardId);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorProfile.editCardHeader')}
        </Text>
      </View>

      <TabletContainer>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 pt-6 pb-10 gap-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-h4 font-semibold font-sans text-grey-900">
              {t('donorProfile.editCardTitle')}
            </Text>

            <View className="gap-4">
              <Input
                label={t('donorProfile.cardNumberLabel')}
                placeholder={t('donorProfile.cardNumberPlaceholder')}
                value={cardNumber}
                onChangeText={handleCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label={t('donorProfile.expiryLabel')}
                    placeholder={t('donorProfile.expiryPlaceholder')}
                    value={expiry}
                    onChangeText={handleExpiry}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label={t('donorProfile.cvvLabel')}
                    placeholder={t('donorProfile.cvvPlaceholder')}
                    value={cvv}
                    onChangeText={handleCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <Input
                label={t('donorProfile.zipLabel')}
                placeholder=""
                value={zipCode}
                onChangeText={handleZip}
                maxLength={10}
              />
            </View>

            <CheckboxGroup
              options={[{ label: t('donorProfile.saveCardLabel'), value: 'save' }]}
              values={saveCard ? ['save'] : []}
              onChange={(vals) => handleSaveCard(vals.includes('save'))}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Sticky bottom CTA */}
        <View className="px-5 pb-6 pt-4 border-t border-grey-100">
          <Button
            label={t('donorProfile.saveBtn')}
            variant="filled"
            size="large"
            fullWidth
            disabled={!isValid && cardNumber.length === 0}
            onPress={() => handleSave(onSave)}
          />
        </View>
      </TabletContainer>
    </SafeAreaView>
  );
}
