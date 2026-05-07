import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import type { DonorSavedPaymentMethod } from '../../types/donorDonation.types';

export interface DonorSavedPaymentMethodCardProps {
  variant: 'saved';
  method: DonorSavedPaymentMethod;
  selected: boolean;
  onSelect: () => void;
}

export interface DonorAddNewMethodCardProps {
  variant: 'add-new';
  label: string;
  subtitle: string;
  icon: 'credit-card' | 'bank';
  onAdd: () => void;
}

export type DonorPaymentMethodCardProps =
  | DonorSavedPaymentMethodCardProps
  | DonorAddNewMethodCardProps;

const BRAND_ICON: Record<DonorSavedPaymentMethod['brand'], React.ReactNode> = {
  mastercard: (
    <MaterialCommunityIcons
      name="credit-card"
      size={22}
      color={primitiveColors['primary-500']}
    />
  ),
  visa: (
    <MaterialCommunityIcons
      name="credit-card-outline"
      size={22}
      color={primitiveColors['primary-500']}
    />
  ),
};

const BRAND_LABEL: Record<DonorSavedPaymentMethod['brand'], string> = {
  mastercard: 'Mastercard',
  visa: 'Visa',
};

export function DonorPaymentMethodCard(props: DonorPaymentMethodCardProps) {
  if (props.variant === 'saved') {
    const { method, selected, onSelect } = props;
    return (
      <Pressable
        onPress={onSelect}
        className="flex-row items-center gap-3 p-4 rounded-lg border border-grey-200 bg-white"
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
      >
        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
          {BRAND_ICON[method.brand]}
        </View>

        <View className="flex-1 gap-0.5">
          <Text className="text-s2 font-semibold font-sans text-grey-900">
            {`${BRAND_LABEL[method.brand]} •••• ${method.last4}`}
          </Text>
          <Text className="text-b4 font-sans text-grey-500">
            {`Expires ${method.expires}`}
          </Text>
        </View>

        <View className="w-5 h-5 rounded-full border-[1.5px] border-primary-500 items-center justify-center shrink-0">
          {selected && (
            <View className="w-2.5 h-2.5 rounded-full bg-primary-500" />
          )}
        </View>
      </Pressable>
    );
  }

  const { label, subtitle, icon, onAdd } = props;
  return (
    <Pressable
      onPress={onAdd}
      className="flex-row items-center gap-3 p-4 rounded-lg border border-grey-200 bg-white"
      accessibilityRole="button"
    >
      <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center shrink-0">
        {icon === 'credit-card' ? (
          <Feather name="credit-card" size={20} color={primitiveColors['primary-500']} />
        ) : (
          <MaterialCommunityIcons name="bank-outline" size={20} color={primitiveColors['primary-500']} />
        )}
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-s2 font-semibold font-sans text-grey-900">{label}</Text>
        <Text className="text-b4 font-sans text-grey-500">{subtitle}</Text>
      </View>

      <Feather name="plus" size={20} color={primitiveColors['primary-500']} />
    </Pressable>
  );
}
