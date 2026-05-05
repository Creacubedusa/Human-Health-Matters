import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { RadioGroup } from '@shared/components/ui/RadioGroup';
import { useDonorFrequency } from '../hooks/useDonorFrequency';
import type { DonorFrequency } from '../types/donorProfile.types';

export interface DonorFrequencyViewProps {
  onBack: () => void;
  onSave: () => void;
}

export function DonorFrequencyView({ onBack, onSave }: DonorFrequencyViewProps) {
  const { t } = useTranslation();
  const { selected, setSelected, handleSave } = useDonorFrequency();

  const options = [
    { value: 'one_time', label: t('donorProfile.frequencyOneTime') },
    { value: 'monthly', label: t('donorProfile.frequencyMonthly') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorProfile.frequencyHeader')}
        </Text>
      </View>

      <View className="flex-1 px-5 pt-10 gap-20">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('donorProfile.frequencyTitle')}
        </Text>

        <RadioGroup
          options={options}
          value={selected}
          onChange={(v) => setSelected(v as DonorFrequency)}
        />
      </View>

      {/* Sticky bottom CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorProfile.saveBtn')}
          variant="filled"
          size="large"
          fullWidth
          onPress={() => handleSave(onSave)}
        />
      </View>
    </SafeAreaView>
  );
}
