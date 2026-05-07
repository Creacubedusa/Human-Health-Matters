import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { primitiveColors } from '@design/tokens';
import { Button } from '@shared/components/ui/Button';
import { HeaderBackButton } from '@shared/components/ui/HeaderBackButton';
import { useDonorAddPaymentMethod, type AddMethodType } from '../hooks/useDonorAddPaymentMethod';

export interface DonorAddPaymentMethodViewProps {
  onBack: () => void;
  onCard: () => void;
  onBank: () => void;
}

interface MethodCardProps {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

function MethodCard({ icon, label, subtitle, selected, onPress }: MethodCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-row items-center gap-3 p-4 rounded-lg border',
        selected ? 'border-primary-500 bg-primary-50' : 'border-grey-300 bg-white',
      ].join(' ')}
      accessibilityRole="button"
    >
      <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
        {icon}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-b2 font-semibold font-sans text-grey-900">{label}</Text>
        <Text className="text-b4 font-sans text-grey-500">{subtitle}</Text>
      </View>
      <Feather name="plus" size={20} color={primitiveColors['primary-500']} />
    </Pressable>
  );
}

export function DonorAddPaymentMethodView({ onBack, onCard, onBank }: DonorAddPaymentMethodViewProps) {
  const { t } = useTranslation();
  const { selected, setSelected, canContinue, handleContinue } = useDonorAddPaymentMethod();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 bg-primary-50 gap-3">
        <HeaderBackButton onPress={onBack} accessibilityLabel={t('common.back')} />
        <Text className="text-s1 font-semibold font-sans text-grey-900 flex-1 text-center mr-7">
          {t('donorProfile.addMethodHeader')}
        </Text>
      </View>

      <View className="flex-1 px-5 pt-6 gap-6">
        {/* Title */}
        <View className="gap-2">
          <Text className="text-h4 font-semibold font-sans text-grey-900">
            {t('donorProfile.addMethodTitle')}
          </Text>
          <Text className="text-b2 font-sans text-grey-500">
            {t('donorProfile.addMethodSubtitle')}
          </Text>
        </View>

        {/* Section label */}
        <View className="gap-3">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {t('donorProfile.addMethodSectionLabel')}
          </Text>

          <MethodCard
            icon={<Feather name="credit-card" size={20} color={primitiveColors['primary-500']} />}
            label={t('donorProfile.addMethodDebitLabel')}
            subtitle={t('donorProfile.addMethodDebitSub')}
            selected={selected === 'card'}
            onPress={() => setSelected('card' as AddMethodType)}
          />

          <MethodCard
            icon={<MaterialCommunityIcons name="bank-outline" size={20} color={primitiveColors['primary-500']} />}
            label={t('donorProfile.addMethodBankLabel')}
            subtitle={t('donorProfile.addMethodBankSub')}
            selected={selected === 'bank'}
            onPress={() => setSelected('bank' as AddMethodType)}
          />
        </View>
      </View>

      {/* Sticky bottom CTA */}
      <View className="px-5 pb-6 pt-4 border-t border-grey-100">
        <Button
          label={t('donorProfile.continueBtn')}
          variant="filled"
          size="large"
          fullWidth
          disabled={!canContinue}
          onPress={() => handleContinue(onCard, onBank)}
          iconRight={<Feather name="arrow-right" size={18} color={primitiveColors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}
