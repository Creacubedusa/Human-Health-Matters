import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';

interface InsuranceEntryQuestionProps {
  onChooseInsurance: () => void;
  onChooseNoInsurance: () => void;
}

export function InsuranceEntryQuestion({
  onChooseInsurance,
  onChooseNoInsurance,
}: InsuranceEntryQuestionProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-8 pt-[83px]">
      <View className="gap-2">
        <Text className="text-h4 font-semibold font-sans text-grey-900">
          {t('insuranceCoverage.entry.title')}
        </Text>
        <Text className="text-b2 font-medium font-sans leading-6 text-grey-500">
          {t('insuranceCoverage.entry.subtitle')}
        </Text>
      </View>

      <View className="gap-4">
        <Button
          label={t('insuranceCoverage.entry.hasInsurance')}
          onPress={onChooseInsurance}
          variant="filled"
          size="large"
          fullWidth
        />
        <Button
          label={t('insuranceCoverage.entry.noInsurance')}
          onPress={onChooseNoInsurance}
          variant="outline"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}
