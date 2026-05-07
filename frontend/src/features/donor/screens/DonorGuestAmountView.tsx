import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { Input } from '@shared/components/ui/Input';
import { GUEST_PRESET_AMOUNTS, useDonorGuestAmount } from '../hooks/useDonorGuestAmount';
import type { DonorGuestFrequency } from '../store/donorGuest.store';

export interface DonorGuestAmountViewProps {
  onBack: () => void;
  onDonate: () => void;
}

const FREQ_OPTIONS: { value: DonorGuestFrequency; labelKey: string }[] = [
  { value: 'one_time', labelKey: 'donorGuest.oneTime' },
  { value: 'monthly',  labelKey: 'donorGuest.monthly' },
];

export function DonorGuestAmountView({ onBack, onDonate }: DonorGuestAmountViewProps) {
  const { t } = useTranslation();
  const { amount, frequency, customInput, isPresetSelected, handlePresetSelect, handleCustomChange, handleFrequencyToggle } = useDonorGuestAmount();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorGuest.headerDonate')}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="gap-2">
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('donorGuest.amountTitle')}
          </Text>
          <Text className="text-b2 font-sans text-grey-500">
            {t('donorGuest.amountSubtitle')}
          </Text>
        </View>

        {/* Frequency toggle */}
        <View className="flex-row gap-3">
          {FREQ_OPTIONS.map((opt) => {
            const selected = frequency === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => handleFrequencyToggle(opt.value)}
                className={['flex-1 py-3 rounded-lg items-center border', selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-200'].join(' ')}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <Text className={['text-b2 font-semibold font-sans', selected ? 'text-white' : 'text-grey-900'].join(' ')}>
                  {t(opt.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Custom amount */}
        <Input
          label={t('donorGuest.customAmountLabel')}
          placeholder="0"
          value={customInput}
          onChangeText={handleCustomChange}
          keyboardType="numeric"
          iconLeft={<Ionicons name="cash-outline" size={18} color={primitiveColors['grey-400']} />}
        />

        {/* Preset grid 2×3 */}
        <View className="gap-3">
          {[0, 1].map((row) => (
            <View key={row} className="flex-row gap-3">
              {GUEST_PRESET_AMOUNTS.slice(row * 3, row * 3 + 3).map((preset) => {
                const selected = isPresetSelected(preset);
                return (
                  <Pressable
                    key={preset}
                    onPress={() => handlePresetSelect(preset)}
                    className={['flex-1 py-3 rounded-lg items-center border', selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-200'].join(' ')}
                    accessibilityRole="button"
                    accessibilityLabel={`$${preset}`}
                  >
                    <Text className={['text-b2 font-semibold font-sans', selected ? 'text-white' : 'text-grey-900'].join(' ')}>
                      {`$${preset}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorGuest.donateBtnLabel', { amount })}
          variant="filled"
          size="large"
          fullWidth
          onPress={onDonate}
          iconRight={<Ionicons name="arrow-forward" size={18} color={primitiveColors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}
